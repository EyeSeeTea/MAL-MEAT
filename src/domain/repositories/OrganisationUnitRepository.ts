import { FutureData } from "$/data/api-futures";
import { OrganisationUnit } from "$/domain/entities/OrganisationUnit";
import { Id } from "$/domain/entities/Ref";

export interface OrganisationUnitRepository {
    getByIds(ids: Id[]): FutureData<OrganisationUnit[]>;
}
