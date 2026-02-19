import { Domain, DomainType } from "$/domain/entities/Domain";
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
    auditQuestions: Record<keyof Domain["audit"], Id>;
}

const CMConfig: DomainConfig = {
    programId: "aovCBBxlKkX",
    stageSections: {
        details: "HRxUosOUz0q",
        audit: "Mkl7IuWLVKh",
        questions: "hG0B3S0j1ml",
    },
};

const SurveillanceConfig: DomainConfig = {
    programId: "aovCBBxlKkX",
    stageSections: {
        details: "HRxUosOUz0q",
        audit: "Mkl7IuWLVKh",
        questions: "gXma9dAmGuU",
    },
};

export const config = {
    domains: {
        CM: CMConfig,
        Surveillance: SurveillanceConfig,
    },
    codesPrefix: "MAL_MEAT_",
    auditQuestions: {
        level: "I76Ac6JHjiE",
        type: "hu0n9bNPx50",
    },
} satisfies DataConfig;
