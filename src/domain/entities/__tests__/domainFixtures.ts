import { createQuestion } from "$/domain/entities/__tests__/questionFixtures";
import { Domain } from "$/domain/entities/Domain";

export function createDomain(): Domain {
    return {
        id: "domain123",
        type: "CM",
        name: "Health Domain",
        audit: {
            domain: {
                id: "domain",
                name: "Domain",
                options: [],
            },
            level: {
                id: "level1",
                name: "Level 1",
                options: [],
            },
            type: {
                id: "type1",
                name: "type 1",
                options: [],
            },
        },
        questions: [createQuestion()],
    };
}
