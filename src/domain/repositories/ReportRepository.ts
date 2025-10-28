import { FutureData } from "$/data/api-futures";
import { Domain } from "$/domain/entities/Domain";
import { Id } from "$/domain/entities/Ref";
import { Report } from "$/domain/entities/Report";

export type GetReportsFilters = {
    domains: Domain[];
    orgUnitId?: Id;
    year?: number;
    levelOfAudit?: string;
};

export interface ReportRepository {
    get(filters: GetReportsFilters): FutureData<Report[]>;
    getById(reportId: Id, domains: Domain[]): FutureData<Report | null>;
}
