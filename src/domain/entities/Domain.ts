import { Option } from "$/domain/entities/Option";
import { Question } from "$/domain/entities/Question";
import { Id } from "$/domain/entities/Ref";

const domainTypes = ["CM", "Surveillance"] as const;
export type DomainType = (typeof domainTypes)[number];

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

export function isDomainType(value: string): value is DomainType {
    return domainTypes.includes(value as DomainType);
}
