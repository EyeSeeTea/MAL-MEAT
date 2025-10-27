import { DomainD2Repository } from "$/data/repositories/DomainD2Repository";
import { DomainTestRepository } from "$/data/repositories/DomainTestRepository";
import { ReportD2Repository } from "$/data/repositories/ReportD2Repository";
import { ReportTestRepository } from "$/data/repositories/ReportTestRepository";
import { DomainRepository } from "$/domain/repositories/DomainRepository";
import { ReportRepository } from "$/domain/repositories/ReportRepository";
import { GetAllDomainsUseCase } from "$/domain/usecases/GetAllDomainsUseCase";
import { GetReportListUseCase } from "$/domain/usecases/GetReportListUseCase";
import { UserD2Repository } from "./data/repositories/UserD2Repository";
import { UserTestRepository } from "./data/repositories/UserTestRepository";
import { UserRepository } from "./domain/repositories/UserRepository";
import { GetCurrentUserUseCase } from "./domain/usecases/GetCurrentUserUseCase";
import { D2Api } from "./types/d2-api";

export type CompositionRoot = ReturnType<typeof getCompositionRoot>;

type Repositories = {
    userRepository: UserRepository;
    reportRepository: ReportRepository;
    domainRepository: DomainRepository;
};

function getCompositionRoot(repositories: Repositories) {
    return {
        users: {
            getCurrent: new GetCurrentUserUseCase(repositories),
        },
        reports: {
            getList: new GetReportListUseCase({ reportRepository: repositories.reportRepository }),
        },
        domains: {
            getAll: new GetAllDomainsUseCase({
                domainRepository: repositories["domainRepository"],
            }),
        },
    };
}

export function getWebappCompositionRoot(api: D2Api) {
    const repositories: Repositories = {
        userRepository: new UserD2Repository(api),
        reportRepository: new ReportD2Repository(api),
        domainRepository: new DomainD2Repository(api),
    };

    return getCompositionRoot(repositories);
}

export function getTestCompositionRoot() {
    const repositories: Repositories = {
        userRepository: new UserTestRepository(),
        reportRepository: new ReportTestRepository(),
        domainRepository: new DomainTestRepository(),
    };

    return getCompositionRoot(repositories);
}
