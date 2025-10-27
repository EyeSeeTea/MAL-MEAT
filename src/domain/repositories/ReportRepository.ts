import { FutureData } from "$/data/api-futures";
import { Report } from "$/domain/entities/Report";

export interface ReportRepository {
    get(): FutureData<Report[]>;
}
