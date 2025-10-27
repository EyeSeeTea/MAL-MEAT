import { FutureData } from "$/data/api-futures";
import { Domain } from "$/domain/entities/Domain";
import { Report } from "$/domain/entities/Report";
import { ReportRepository } from "$/domain/repositories/ReportRepository";

export class GetReportListUseCase {
    constructor(private options: { reportRepository: ReportRepository }) {}

    public execute(options: { domains: Domain[] }): FutureData<Report[]> {
        return this.options.reportRepository.get(options);
    }
}
