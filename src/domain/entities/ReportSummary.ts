import { Id } from "$/domain/entities/Ref";
import { Report } from "$/domain/entities/Report";

export class ReportSummary {
    report: Report;

    id: Id;
    domain: string;
    date: string;
    organisationUnitName: string;
    auditLevel: string;
    averageScore: number;
    majorNonconformities: number;

    constructor(report: Report) {
        this.report = report;
        this.id = report.id;
        this.domain = report.domainName;
        this.date = report.date.toLocaleDateString();
        this.organisationUnitName = report.organisationUnit.name;
        this.auditLevel = report.audit.level?.name ?? "";
        this.averageScore = this.calculateAverageScore();
        this.majorNonconformities = this.countMajorNonconformities();
    }

    calculateAverageScore(): number {
        if (this.report.questions.length === 0) return 0;

        const scoreToPercentage: Record<number, number> = {
            1: 0,
            2: 35,
            4: 70,
            5: 100,
        };

        const totalPercentage = this.report.questions.reduce((sum, question) => {
            const percentage = scoreToPercentage[question.value] ?? 0;
            return sum + percentage;
        }, 0);

        return totalPercentage / this.report.questions.length;
    }

    countMajorNonconformities(): number {
        return this.report.questions.filter(
            question =>
                question.options.find(option => option.score === question.value)
                    ?.isMajorNonConformity === true
        ).length;
    }
}
