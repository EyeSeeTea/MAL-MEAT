import { FutureData } from "$/data/api-futures";
import { Domain } from "$/domain/entities/Domain";
import { Future } from "$/domain/entities/generic/Future";
import { Id } from "$/domain/entities/Ref";
import { Report } from "$/domain/entities/Report";
import { ReportRepository } from "$/domain/repositories/ReportRepository";

export class GetReportWithPreviousUseCase {
    constructor(private options: { reportRepository: ReportRepository }) {}

    public execute({
        reportId,
        domains,
    }: {
        reportId: Id;
        domains: Domain[];
    }): FutureData<{ report: Report; previous: Report[] } | null> {
        return this.options.reportRepository.getById(reportId, domains).flatMap(report => {
            if (!report) {
                return Future.success(null);
            }
            return this.options.reportRepository
                .get({
                    domains,
                    orgUnitId: report.organisationUnit.id,
                })
                .map(reports => {
                    const previousReports = reports.filter(
                        r => r.id !== report.id && r.date <= report.date
                    );
                    return { report, previous: previousReports };
                });
        });
    }
}
