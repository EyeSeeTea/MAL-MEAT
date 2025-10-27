import { createQuestion } from "$/domain/entities/__tests__/questionFixtures";
import { Domain } from "$/domain/entities/Domain";

export function createDomain(): Domain {
    return {
        id: "domain123",
        type: "CM",
        name: "Health Domain",
        questions: [createQuestion()],
    };
}
