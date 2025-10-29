import { Option } from "$/domain/entities/Option";
import { Question } from "$/domain/entities/Question";
import { Id } from "$/domain/entities/Ref";

export type DomainType = "CM";
// TODO: enable Surveillance when we have the metadata ready
//| "Surveillance";

export type ChoiceQuestion = {
    id: string;
    name: string;
    options: Option[];
};

export interface Domain {
    id: Id;
    type: DomainType;
    name: string;
    audit: Record<"level" | "type", ChoiceQuestion>;
    questions: Question[];
}
