import type { D2Api } from "$/types/d2-api";
import { apiToFuture, FutureData } from "$/data/api-futures";
import { ReportRepository } from "$/domain/repositories/ReportRepository";
import { Report } from "$/domain/entities/Report";
import { config } from "$/data/config";
import { Future } from "$/domain/entities/generic/Future";
import { Id } from "$/domain/entities/Ref";

export class ReportD2Repository implements ReportRepository {
    constructor(private api: D2Api) {}

    get(): FutureData<Report[]> {
        const domainProgramIds = Object.values(config.domains).map(domain => domain.programId);
        const getPrograms$ = domainProgramIds.map(programId =>
            apiToFuture(
                this.api.tracker.events.get({
                    fields: eventFields,
                    program: programId,
                    skipPaging: true,
                })
            )
        );
        return Future.joinObj({
            questionsDataElements: this.getQuestionsDataElements(),
            eventResponses: Future.parallel(getPrograms$, { concurrency: 2 }),
        }).map(({ questionsDataElements, eventResponses }) => {
            return eventResponses.flatMap(d2Events =>
                d2Events.instances.map(event => this.buildReport(event, questionsDataElements))
            );
        });
    }

    private getQuestionsDataElements(): FutureData<DataElementsBySection> {
        const programStageSectionIds = Object.values(config.domains).map(
            domain => domain.stageSections.questions
        );
        return apiToFuture(
            this.api.models.programStageSections.get({
                paging: false,
                fields: {
                    id: true,
                    dataElements: { id: true },
                },
                filter: {
                    id: { in: programStageSectionIds },
                },
            })
        ).map(response => {
            return response.objects.reduce(
                (result, next) => ({
                    ...result,
                    [next.id]: next.dataElements ? next.dataElements.map((de: any) => de.id) : [],
                }),
                {}
            );
        });
    }

    private buildReport(d2Event: any, questionDataElements: DataElementsBySection): Report {
        const domainConfig = Object.values(config.domains).find(
            domain => domain.programId === d2Event.program
        );
        if (!domainConfig) {
            throw new Error(`Unknown domain for program ID ${d2Event.program}`);
        }
        const questionDataElementIds = questionDataElements[domainConfig.stageSections.questions];
        if (!questionDataElementIds) {
            throw new Error(
                `No question data elements found for section ID ${domainConfig.stageSections.questions}`
            );
        }
        const questions = d2Event.dataValues.filter((dv: any) =>
            questionDataElementIds.includes(dv.dataElement)
        );
        return {
            auditDomain: "",
            auditLevel: "",
            auditType: "",
            date: new Date(d2Event.occurredAt),
            domainId: d2Event.program,
            id: d2Event.event,
            organisationUnit: {
                id: d2Event.orgUnit.id,
                name: d2Event.orgUnit.name,
            },
            questions: questions.map((q: any) => {
                return {
                    id: q.dataElement,
                    value: q.value,
                } as any;
            }),
        };
    }
}

const eventFields = {
    program: true,
    programStage: true,
    event: true,
    dataValues: true,
    orgUnit: { id: true, name: true },
    occurredAt: true,
    scheduledAt: true,
    status: true,
} as const;

type DataElementsBySection = Record<Id, Id[]>;
