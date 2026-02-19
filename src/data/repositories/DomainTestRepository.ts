import { FutureData } from "$/data/api-futures";
import { createDomain } from "$/domain/entities/__tests__/domainFixtures";
import { Domain } from "$/domain/entities/Domain";
import { Future } from "$/domain/entities/generic/Future";
import { DomainRepository } from "$/domain/repositories/DomainRepository";

export class DomainTestRepository implements DomainRepository {
    get(): FutureData<Domain[]> {
        return Future.success([createDomain()]);
    }
}
