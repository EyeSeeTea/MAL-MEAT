import { Option } from "$/domain/entities/Option";
import { OrganisationUnit } from "$/domain/entities/OrganisationUnit";
import { AnsweredQuestion } from "$/domain/entities/Question";
import { Id } from "$/domain/entities/Ref";

export interface Report {
    id: Id;
    domainId: Id;
    domainName: string;
    date: Date;
    organisationUnit: OrganisationUnit;
    audit: {
        level: Option;
        domain: Option;
        type: Option;
    };
    questions: AnsweredQuestion[];
}
