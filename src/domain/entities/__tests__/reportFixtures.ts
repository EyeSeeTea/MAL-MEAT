import { Report } from "$/domain/entities/Report";

const baseReport: Report = {
    audit: {
        level: { id: "", name: "", code: "" },
        type: { id: "", name: "", code: "" },
        domain: { id: "", name: "", code: "" },
    },
    date: new Date(),
    domainId: "",
    domainName: "",
    id: "",
    organisationUnit: {
        id: "",
        name: "",
        path: [""],
    },
    questions: [],
};

export function createReportList(): Report[] {
    return [{ ...baseReport }];
}
