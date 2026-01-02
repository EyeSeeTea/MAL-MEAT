import type { D2Api, D2OrganisationUnitSchema, SelectedPick } from "$/types/d2-api";
import { apiToFuture, FutureData } from "$/data/api-futures";
import { GetReportsFilters, ReportRepository } from "$/domain/repositories/ReportRepository";
import { Report } from "$/domain/entities/Report";
import { Future } from "$/domain/entities/generic/Future";
import { Domain, DomainType } from "$/domain/entities/Domain";
import { D2EventSchema } from "@eyeseetea/d2-api";
import { config } from "$/data/config";
import { DHIS_OU_PATH_SEPARATOR } from "$/data/repositories/OrganisationUnitD2Repository";
import { Id } from "$/domain/entities/Ref";

export class ReportD2Repository implements ReportRepository {
    constructor(private api: D2Api) {}

    private orgUnitsCache: Map<Id, D2OrgUnit> = new Map();

    get(filters: GetReportsFilters): FutureData<Report[]> {
        const domainProgramIds = [...new Set(filters.domains.map(domain => domain.id))];
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
        const getEventsForPrograms$ = domainProgramIds.map(programId =>
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
        // Multiple domains can belong to same program
        return Future.parallel(getEventsForPrograms$, { concurrency: 2 }).flatMap(
            eventResponses => {
                const d2Events = eventResponses.flatMap(r => r.instances);
                return this.getOrgUnitsForEvents(d2Events).flatMap(d2OrgUnits => {
                    const reports = d2Events.flatMap(d2Event =>
                        this.buildReports(d2Event, filters.domains, d2OrgUnits)
                    );
                    return Future.success(reports);
                });
            }
        );
    }

    getById(reportId: Id, domainType: DomainType, domains: Domain[]): FutureData<Report | null> {
        const domain = domains.find(d => d.type === domainType);
        if (!domain) {
            return Future.error(new Error("Couldn't find domain for the given domain type"));
        }
        const getEvent$ = apiToFuture(
            this.api.tracker.events.get({
                fields: eventFields,
                event: reportId,
                skipPaging: true,
            })
        );
        return getEvent$.flatMap(eventResponse => {
            const d2Event = eventResponse.instances[0];
            if (!d2Event || !this.eventHasDomain(d2Event, domain)) {
                return Future.success(null);
            }
            return this.getOrgUnitsForEvents([d2Event]).flatMap(orgUnits => {
                const report = this.buildReports(d2Event, [domain], orgUnits);
                return Future.success(report[0] ?? null);
            });
        });
    }

    private getOrgUnitsForEvents(events: D2Event[]): FutureData<D2OrgUnit[]> {
        const orgUnitIds = new Set(events.map(d2Event => d2Event.orgUnit));

        const cachedOrgUnits = Array.from(orgUnitIds)
            .map(id => this.orgUnitsCache.get(id))
            .filter((ou): ou is D2OrgUnit => ou !== undefined);

        const cachedIds = new Set(cachedOrgUnits.map(ou => ou.id));
        const missingIds = Array.from(orgUnitIds).filter(id => !cachedIds.has(id));

        if (missingIds.length === 0) {
            return Future.success(cachedOrgUnits);
        }

        return apiToFuture(
            this.api.models.organisationUnits.get({
                fields: orgUnitFields,
                paging: false,
                filter: {
                    id: {
                        in: missingIds,
                    },
                },
            })
        ).map(response => {
            response.objects.forEach(ou => {
                this.orgUnitsCache.set(ou.id, ou);
            });
            return [...cachedOrgUnits, ...response.objects];
        });
    }

    /**
     * Build reports from a D2 event for the given domains
     * Returns only existing and valid reports (a domain may not be present in the event, a report may not contains all required questions)
     */
    private buildReports(d2Event: D2Event, domains: Domain[], orgUnits: D2OrgUnit[]): Report[] {
        const filteredDomains = domains.filter(
            domain => domain.id === d2Event.program && this.eventHasDomain(d2Event, domain)
        );
        if (filteredDomains.length === 0) {
            throw new Error(`Unknown domain for program ID ${d2Event.program}`);
        }
        const orgUnit = orgUnits.find(ou => ou.id === d2Event.orgUnit);
        if (!orgUnit) {
            throw new Error(`Organisation unit not found for ID ${d2Event.orgUnit}`);
        }
        return filteredDomains
            .map(d => {
                const questions = d.questions.map(q => {
                    const dataValue = d2Event.dataValues.find((dv: any) => dv.dataElement === q.id);
                    if (!dataValue) {
                        console.warn(
                            `Data value not found for question ID ${q.id} in event ${d2Event.event} (domain ${d.type})`
                        );
                        return null;
                    }
                    return {
                        ...q,
                        value: Number(dataValue.value),
                    };
                });
                if (questions.some(q => !q)) {
                    return null;
                }
                return {
                    domainType: d.type,
                    audit: this.buildAudit(d2Event, d),
                    date: new Date(d2Event.occurredAt),
                    domainId: d2Event.program,
                    id: d2Event.event,
                    organisationUnit: {
                        id: orgUnit.id,
                        name: orgUnit.name,
                        path: orgUnit.path.split(DHIS_OU_PATH_SEPARATOR),
                    },
                    questions,
                };
            })
            .filter(Boolean) as Report[];
    }

    private eventHasDomain(d2Event: D2Event, domain: Domain): boolean {
        return (
            d2Event.program === domain.id &&
            d2Event.dataValues.some(dv =>
                domain.questions.some(q => q.id === dv.dataElement && dv.value !== undefined)
            )
        );
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
