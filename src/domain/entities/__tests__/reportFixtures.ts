import { Report } from "$/domain/entities/Report";

const baseReport: Report = {
    auditDomain: "",
    auditLevel: "",
    auditType: "",
    date: new Date(),
    domainId: "",
    id: "",
    organisationUnit: {
        id: "",
        name: "",
    },
    questions: [],
};

export function createReportList(): Report[] {
    return [{ ...baseReport }];
}
