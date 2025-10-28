import type { D2Api, D2OrganisationUnitSchema, SelectedPick } from "$/types/d2-api";
import { apiToFuture, FutureData } from "$/data/api-futures";
import { GetReportsFilters, ReportRepository } from "$/domain/repositories/ReportRepository";
import { Report } from "$/domain/entities/Report";
import { Future } from "$/domain/entities/generic/Future";
import { Domain } from "$/domain/entities/Domain";
import { D2EventSchema } from "@eyeseetea/d2-api";
import { config } from "$/data/config";
import { DHIS_OU_PATH_SEPARATOR } from "$/data/repositories/OrganisationUnitD2Repository";

export class ReportD2Repository implements ReportRepository {
    constructor(private api: D2Api) {}

    get(filters: GetReportsFilters): FutureData<Report[]> {
        const domainProgramIds = filters.domains.map(domain => domain.id);
        const orgUnitParams = filters.orgUnitId
            ? { orgUnit: filters.orgUnitId, ouMode: "DESCENDANTS" as const }
            : {};
        const yearParams = filters.year
            ? {
                  occurredAfter: new Date(filters.year, 0, 1).toISOString().split("T")[0],
                  occurredBefore: new Date(filters.year + 1, 0, 1).toISOString().split("T")[0],
              }
            : {};
        const levelOfAuditParams = filters.levelOfAudit
            ? {
                  filter: `${config.auditQuestions.level}:in:${filters.levelOfAudit}`,
              }
            : {};
        const getPrograms$ = domainProgramIds.map(programId =>
            apiToFuture(
                this.api.tracker.events.get({
                    fields: eventFields,
                    program: programId,
                    skipPaging: true,
                    ...orgUnitParams,
                    ...yearParams,
                    ...levelOfAuditParams,
                })
            )
        );
        // TODO: find a better way to mix all the responses from separate programs with paging
        // the api does not support filtering by multiple programs at once
        return Future.parallel(getPrograms$, { concurrency: 2 }).flatMap(eventResponses => {
            const orgUnitIds = eventResponses.flatMap(d2Events =>
                d2Events.instances.map(e => e.orgUnit)
            );
            const getOrgUnits$ = apiToFuture(
                this.api.models.organisationUnits.get({
                    fields: orgUnitFields,
                    paging: false,
                    filter: {
                        id: {
                            in: orgUnitIds,
                        },
                    },
                })
            );
            return getOrgUnits$.flatMap(orgUnitsResponse => {
                const reports = eventResponses.flatMap(d2Events => {
                    return d2Events.instances.map(event =>
                        this.buildReport(event, filters.domains, orgUnitsResponse.objects)
                    );
                });
                return Future.success(reports);
            });
        });
    }

    private buildReport(d2Event: D2Event, domains: Domain[], orgUnits: D2OrgUnit[]): Report {
        const domain = domains.find(domain => domain.id === d2Event.program);
        if (!domain) {
            throw new Error(`Unknown domain for program ID ${d2Event.program}`);
        }
        const orgUnit = orgUnits.find(ou => ou.id === d2Event.orgUnit);
        if (!orgUnit) {
            throw new Error(`Organisation unit not found for ID ${d2Event.orgUnit}`);
        }
        return {
            domainName: domain.name,
            audit: this.buildAudit(d2Event, domain),
            date: new Date(d2Event.occurredAt),
            domainId: d2Event.program,
            id: d2Event.event,
            organisationUnit: {
                id: orgUnit.id,
                name: orgUnit.name,
                path: orgUnit.path.split(DHIS_OU_PATH_SEPARATOR),
            },
            questions: domain.questions.map(q => {
                const dataValue = d2Event.dataValues.find((dv: any) => dv.dataElement === q.id);
                if (!dataValue) {
                    // throw new Error(
                    //     `Data value not found for question ID ${q.id} in event ${d2Event.event}`
                    // );
                    // TODO: DEFINE THIS BEHAVIOR
                    console.warn(
                        `Data value not found for question ID ${q.id} in event ${d2Event.event}`
                    );
                    return {
                        ...q,
                        value: 1,
                    };
                }
                return {
                    ...q,
                    value: Number(dataValue.value),
                };
            }),
        };
    }

    private buildAudit(d2Event: D2Event, domain: Domain): Report["audit"] {
        return Object.fromEntries(
            Object.entries(domain.audit).map(([key, question]) => {
                const dataValue = d2Event.dataValues.find(dv => dv.dataElement === question.id);
                if (!dataValue) {
                    return [key as keyof Report["audit"], undefined] as const;
                }
                const option = question.options.find(opt => opt.code === dataValue.value);
                if (!option) {
                    throw new Error(
                        `Option not found for audit question ID ${question.id} with value ${dataValue.value} in event ${d2Event.event}`
                    );
                }
                return [key as keyof Report["audit"], option] as const;
            })
        ) as Report["audit"];
    }
}

const eventFields = {
    program: true,
    programStage: true,
    event: true,
    dataValues: { dataElement: true, value: true },
    orgUnit: true,
    orgUnitName: true,
    occurredAt: true,
    scheduledAt: true,
    status: true,
} as const;

const orgUnitFields = {
    id: true,
    name: true,
    path: true,
} as const;

type D2Event = SelectedPick<D2EventSchema, typeof eventFields> & {
    occurredAt: string;
};

type D2OrgUnit = SelectedPick<D2OrganisationUnitSchema, typeof orgUnitFields>;
