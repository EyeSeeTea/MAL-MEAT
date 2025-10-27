import { Question } from "$/domain/entities/Question";

export function createQuestion(): Question {
    return {
        id: "question123",
        text: "What is your health status?",
        options: [
            {
                id: "option1",
                isMajorNonConformity: true,
                score: 1,
                auditEvidence: "evidence",
                report: "report",
                response: "response",
            },
            {
                id: "option2",
                isMajorNonConformity: true,
                score: 2,
                auditEvidence: "evidence2",
                report: "report2",
                response: "response2",
            },
            {
                id: "option4",
                isMajorNonConformity: true,
                score: 4,
                auditEvidence: "evidence4",
                report: "report4",
                response: "response4",
            },
            {
                id: "option5",
                isMajorNonConformity: true,
                score: 5,
                auditEvidence: "evidence5",
                report: "report5",
                response: "response5",
            },
        ],
    };
}
