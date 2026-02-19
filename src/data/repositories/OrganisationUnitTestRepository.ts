import { FutureData } from "$/data/api-futures";
import { Future } from "$/domain/entities/generic/Future";
import { OrganisationUnit } from "$/domain/entities/OrganisationUnit";
import { Id } from "$/domain/entities/Ref";
import { OrganisationUnitRepository } from "$/domain/repositories/OrganisationUnitRepository";

export class OrganisationUniTestRepository implements OrganisationUnitRepository {
    public getByIds(ids: Id[]): FutureData<OrganisationUnit[]> {
        return Future.success(
            ids.map(id => ({
                id,
                name: `Organisation Unit ${id}`,
                path: [id],
            }))
        );
    }
}
