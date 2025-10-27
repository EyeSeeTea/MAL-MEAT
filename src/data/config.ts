import { DomainType } from "$/domain/entities/Domain";
import { Id } from "$/domain/entities/Ref";

interface DomainConfig {
    programId: Id;
    stageSections: {
        details: Id;
        audit: Id;
        questions: Id;
    };
}

interface DataConfig {
    domains: Record<DomainType, DomainConfig>;
    codesPrefix: string;
}

const CMConfig: DomainConfig = {
    programId: "aovCBBxlKkX",
    stageSections: {
        details: "HRxUosOUz0q",
        audit: "Mkl7IuWLVKh",
        questions: "hG0B3S0j1ml",
    },
};

// const SurveillanceConfig: DomainConfig = {
//     programId: "HBqDdmS6zgz",
//     stageSections: {
//         details: "oI8oELri0TE",
//         audit: "gARUS8N1UfB",
//         questions: "IvtnyV05RI8",
//     },
// };

export const config = {
    domains: {
        CM: CMConfig,
        // Surveillance: SurveillanceConfig,
    },
    codesPrefix: "MAL_MEAT_",
} satisfies DataConfig;
