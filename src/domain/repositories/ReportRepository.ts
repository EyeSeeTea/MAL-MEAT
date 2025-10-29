import { FutureData } from "$/data/api-futures";
import { Domain } from "$/domain/entities/Domain";
import { Id } from "$/domain/entities/Ref";
import { Report } from "$/domain/entities/Report";

type GetReportsBaseFilters = {
    domains: Domain[];
    year?: number;
    levelOfAudit?: string;
};

type GetReportsWithoutOrgUnit = GetReportsBaseFilters & {
    orgUnitId?: never;
    orgUnitMode?: never;
};

type GetReportsWithOrgUnit = GetReportsBaseFilters & {
    orgUnitId: Id;
    orgUnitMode?: "DESCENDANTS" | "SELECTED";
};

export type GetReportsFilters = GetReportsWithoutOrgUnit | GetReportsWithOrgUnit;

export interface ReportRepository {
    get(filters: GetReportsFilters): FutureData<Report[]>;
    getById(reportId: Id, domains: Domain[]): FutureData<Report | null>;
}
