import { OrganisationUnit } from "$/domain/entities/OrganisationUnit";
import { AnsweredQuestion } from "$/domain/entities/Question";
import { Id } from "$/domain/entities/Ref";

export interface Report {
    id: Id;
    domainId: Id;
    date: Date;
    organisationUnit: OrganisationUnit;
    auditLevel: string;
    auditDomain: string;
    auditType: string;
    questions: AnsweredQuestion[];
}
