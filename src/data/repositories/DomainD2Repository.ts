import { apiToFuture, FutureData } from "$/data/api-futures";
import { config } from "$/data/config";
import { Domain, DomainType } from "$/domain/entities/Domain";
import { Future } from "$/domain/entities/generic/Future";
import { Question, QuestionOption } from "$/domain/entities/Question";
import { DomainRepository } from "$/domain/repositories/DomainRepository";
import { D2Api, D2ConstantSchema, D2ProgramSchema, SelectedPick } from "$/types/d2-api";
import i18n from "$/utils/i18n";

export class DomainD2Repository implements DomainRepository {
    constructor(private api: D2Api) {}

    get(): FutureData<Domain[]> {
        const domainProgramIds = [
            ...new Set(Object.values(config.domains).map(domain => domain.programId)),
        ];
        const getPrograms$ = apiToFuture(
            this.api.models.programs.get({
                fields: programFields,
                paging: false,
                filter: {
                    id: { in: domainProgramIds },
                },
            })
        );
        const getConstants$ = apiToFuture(
            this.api.models.constants.get({
                fields: constantFields,
                paging: false,
                filter: {
                    code: { like: `${config.codesPrefix}%` },
                },
            })
        );
        return Future.joinObj({
            programs: getPrograms$,
            constants: getConstants$,
        }).flatMap(({ programs, constants }) => {
            return Future.success(this.buildDomains(programs.objects, constants.objects));
        });
    }

    private buildDomains(domainPrograms: D2Program[], constants: D2Constant[]): Domain[] {
        return Object.entries(config.domains).map(([domainType, domainConfig]) => {
            const programData = domainPrograms.find(dp => dp.id === domainConfig.programId);
            if (!programData) {
                throw new Error(`Program data not found for domain type: ${domainType}`);
            }
            return this.buildDomain(domainType as DomainType, programData, constants);
        });
    }

    private buildDomain(
        domainType: DomainType,
        domainData: D2Program,
        constants: D2Constant[]
    ): Domain {
        const questionsSection = domainData.programStages[0]?.programStageSections.find(
            section => section.id === config.domains[domainType].stageSections.questions
        );
        if (!questionsSection) {
            throw new Error(`Questions section not found for domain type: ${domainType}`);
        }
        const auditSection = domainData.programStages[0]?.programStageSections.find(
            section => section.id === config.domains[domainType].stageSections.audit
        );
        if (!auditSection) {
            throw new Error(`Questions section not found for domain type: ${domainType}`);
        }
        return {
            id: domainData.id,
            name: this.getDomainNameByType(domainType),
            type: domainType,
            audit: this.buildAuditQuestions(auditSection.dataElements),
            questions: this.buildQuestions(questionsSection.dataElements, constants),
        };
    }

    private getDomainNameByType(domainType: DomainType): string {
        const domainNames: Record<DomainType, string> = {
            CM: i18n.t("Case Management"),
            Surveillance: i18n.t("Surveillance"),
        };
        return domainNames[domainType];
    }

    private buildAuditQuestions(dataElements: D2DataElement[]): Domain["audit"] {
        const obj = Object.fromEntries(
            Object.entries(config.auditQuestions).map(([key, dataElementId]) => {
                const dataElement = dataElements.find(de => de.id === dataElementId);
                if (!dataElement) {
                    throw new Error(
                        `Audit question data element not found for ID: ${dataElementId}`
                    );
                }
                return [
                    key,
                    {
                        id: dataElement.id,
                        name: dataElement.formName,
                        options: dataElement.optionSet.options.map(opt => ({
                            id: opt.id,
                            code: opt.code,
                            name: opt.name,
                        })),
                    },
                ];
            })
        );
        return obj as Domain["audit"];
    }

    private buildQuestions(dataElements: D2DataElement[], constants: D2Constant[]): Question[] {
        return dataElements.map(de => {
            const options: QuestionOption[] = de.optionSet.options.map(opt => {
                const reportConstant = constants.find(c => c.code === `${de.code}_${opt.code}`);
                if (!reportConstant) {
                    throw new Error(
                        `Report constant not found for data element code: ${de.code} and option code: ${opt.code}`
                    );
                }
                return {
                    id: opt.id,
                    response: opt.name,
                    auditEvidence: "", // TODO get auditEvidence from separate constant _NYI etc
                    score: Number(opt.code),
                    isMajorNonConformity: reportConstant.value === 1,
                    report: reportConstant.description,
                };
            });

            return {
                id: de.id,
                text: de.formName,
                options: options,
            } as Question;
        });
    }
}

const programFields = {
    id: true,
    name: true,
    code: true,
    description: true,
    programStages: {
        id: true,
        name: true,
        programStageSections: {
            id: true,
            name: true,
            dataElements: {
                id: true,
                formName: true,
                code: true,
                optionSet: { id: true, options: { id: true, name: true, code: true } },
            },
        },
    },
} as const;

const constantFields = {
    id: true,
    code: true,
    name: true,
    description: true,
    value: true,
} as const;

type D2Constant = SelectedPick<D2ConstantSchema, typeof constantFields>;
type D2Program = SelectedPick<D2ProgramSchema, typeof programFields>;
type D2DataElement =
    D2Program["programStages"][number]["programStageSections"][number]["dataElements"][number];
