import { Domain } from "$/domain/entities/Domain";
import { OrganisationUnit } from "$/domain/entities/OrganisationUnit";
import { Report } from "$/domain/entities/Report";
import { ReportSummary } from "$/domain/entities/ReportSummary";

export type ReportsByDomain = {
    domain: Domain;
    reports: Report[];
};

export type ReportByDomain = {
    domain: Domain;
    report: ReportSummary | null;
};

export class OrganisationUnitSummary {
    organisationUnit: OrganisationUnit;
    list: ReportsByDomain[];
    latestReportByDomain: ReportByDomain[];
    totalMajorNonconformities: number;
    totalAverageScore: number;

    constructor(organisationUnit: OrganisationUnit, list: ReportsByDomain[]) {
        this.organisationUnit = organisationUnit;
        this.list = list;
        this.latestReportByDomain = this.getLatestReportSummaryByDomain();
        this.totalMajorNonconformities = this.getTotalMajorNonconformities();
        this.totalAverageScore = this.getTotalAverageScore();
    }

    private getLatestReportSummaryByDomain(): ReportByDomain[] {
        return this.list.map(({ domain, reports }) => {
            const reportsSorted = reports.sort((a, b) => b.date.getTime() - a.date.getTime());
            return {
                domain,
                report: reportsSorted[0] ? new ReportSummary(reportsSorted[0]) : null,
            };
        });
    }

    private getTotalMajorNonconformities(): number {
        const totalMajor = this.latestReportByDomain.reduce((sum, { report }) => {
            const major = report?.majorNonconformities ?? 0;
            return sum + major;
        }, 0);
        return totalMajor;
    }

    private getTotalAverageScore(): number {
        const reports = this.latestReportByDomain
            .map(({ report }) => report)
            .filter(report => report !== null);
        if (reports.length === 0) return 0;
        const sum = reports.reduce((sum, report) => {
            const avg = report.averageScore;
            return sum + avg;
        }, 0);
        return sum / reports.length;
    }
}
