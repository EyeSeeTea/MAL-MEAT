import { FutureData } from "$/data/api-futures";
import { Domain } from "$/domain/entities/Domain";

export interface DomainRepository {
    get(): FutureData<Domain[]>;
}
