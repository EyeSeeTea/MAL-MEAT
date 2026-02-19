export interface Question {
    id: string;
    text: string;
    options: QuestionOption[];
}

export interface QuestionOption {
    id: string;
    response: string;
    auditEvidence: string;
    score: number;
    isMajorNonConformity: boolean;
    report: string;
}

export interface AnsweredQuestion extends Question {
    value: QuestionOption["score"];
}
