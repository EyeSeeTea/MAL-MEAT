import { FutureData } from "$/data/api-futures";
import { Domain } from "$/domain/entities/Domain";
import { DomainRepository } from "$/domain/repositories/DomainRepository";

export class GetAllDomainsUseCase {
    constructor(private options: { domainRepository: DomainRepository }) {}

    public execute(): FutureData<Domain[]> {
        return this.options.domainRepository.get();
    }
}
