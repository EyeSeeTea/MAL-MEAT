import { FutureData } from "$/data/api-futures";
import { ReportRepository } from "$/domain/repositories/ReportRepository";
import { Report } from "$/domain/entities/Report";
import { createReport, createReportList } from "$/domain/entities/__tests__/reportFixtures";
import { Future } from "$/domain/entities/generic/Future";
import { Id } from "$/domain/entities/Ref";

export class ReportTestRepository implements ReportRepository {
    get(): FutureData<Report[]> {
        return Future.success(createReportList());
    }
    getById(reportId: Id): FutureData<Report | null> {
        return Future.success(createReport({ id: reportId }));
    }
}
