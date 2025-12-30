import { DomainType } from "$/domain/entities/Domain";
import { Option } from "$/domain/entities/Option";
import { OrganisationUnit } from "$/domain/entities/OrganisationUnit";
import { AnsweredQuestion } from "$/domain/entities/Question";
import { Id } from "$/domain/entities/Ref";
import { Maybe } from "$/utils/ts-utils";

export interface Report {
    id: Id;
    domainId: Id;
    domainType: DomainType;
    date: Date;
    organisationUnit: OrganisationUnit;
    audit: {
        level: Maybe<Option>;
        type: Maybe<Option>;
    };
    questions: AnsweredQuestion[];
}
