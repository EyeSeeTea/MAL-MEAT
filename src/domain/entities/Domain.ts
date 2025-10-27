import { Question } from "$/domain/entities/Question";
import { Id } from "$/domain/entities/Ref";

export type DomainType = "CM";
// TODO: enable Surveillance when we have the metadata ready
//| "Surveillance";

export interface Domain {
    id: Id;
    type: DomainType;
    name: string;
    questions: Question[];
}
