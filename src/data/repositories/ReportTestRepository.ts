import { FutureData } from "$/data/api-futures";
import { ReportRepository } from "$/domain/repositories/ReportRepository";
import { Report } from "$/domain/entities/Report";
import { createReportList } from "$/domain/entities/__tests__/reportFixtures";
import { Future } from "$/domain/entities/generic/Future";

export class ReportTestRepository implements ReportRepository {
    get(): FutureData<Report[]> {
        return Future.success(createReportList());
    }
}
