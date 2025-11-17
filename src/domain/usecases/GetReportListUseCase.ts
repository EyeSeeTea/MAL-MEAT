import { FutureData } from "$/data/api-futures";
import { Report } from "$/domain/entities/Report";
import { GetReportsFilters, ReportRepository } from "$/domain/repositories/ReportRepository";

export class GetReportListUseCase {
    constructor(private options: { reportRepository: ReportRepository }) {}

    public execute(options: GetReportsFilters): FutureData<Report[]> {
        return this.options.reportRepository.get(options);
    }
}
