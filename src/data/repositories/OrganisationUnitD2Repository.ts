import { apiToFuture, FutureData } from "$/data/api-futures";
import { OrganisationUnit } from "$/domain/entities/OrganisationUnit";
import { Id } from "$/domain/entities/Ref";
import { OrganisationUnitRepository } from "$/domain/repositories/OrganisationUnitRepository";
import { D2Api, D2OrganisationUnitSchema, SelectedPick } from "$/types/d2-api";

export const DHIS_OU_PATH_SEPARATOR = "/";

export class OrganisationUnitD2Repository implements OrganisationUnitRepository {
    constructor(private api: D2Api) {}

    public getByIds(ids: Id[]): FutureData<OrganisationUnit[]> {
        return apiToFuture(
            this.api.models.organisationUnits.get({
                paging: false,
                fields: organisationUnitFields,
                filter: { id: { in: ids } },
            })
        ).map(OrganisationUnits => {
            return OrganisationUnits.objects.map(d2OrganisationUnit =>
                this.buildOrganisationUnit(d2OrganisationUnit)
            );
        });
    }

    private buildOrganisationUnit(OrganisationUnitResponse: D2OrganisationUnit): OrganisationUnit {
        return {
            id: OrganisationUnitResponse.id,
            name: OrganisationUnitResponse.displayName,
            path: OrganisationUnitResponse.path.split(DHIS_OU_PATH_SEPARATOR),
        };
    }
}

const organisationUnitFields = { id: true, displayName: true, path: true } as const;

type D2OrganisationUnit = SelectedPick<D2OrganisationUnitSchema, typeof organisationUnitFields>;
