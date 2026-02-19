import { FutureData } from "$/data/api-futures";
import { OrganisationUnit } from "$/domain/entities/OrganisationUnit";
import { Id } from "$/domain/entities/Ref";
import { OrganisationUnitRepository } from "$/domain/repositories/OrganisationUnitRepository";

export class GetOrganisationUnitsByIds {
    constructor(private options: { organisationUnitRepository: OrganisationUnitRepository }) {}

    public execute(ids: Id[]): FutureData<OrganisationUnit[]> {
        return this.options.organisationUnitRepository.getByIds(ids);
    }
}
