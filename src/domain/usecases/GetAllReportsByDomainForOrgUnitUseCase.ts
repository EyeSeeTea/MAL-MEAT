import { FutureData } from "$/data/api-futures";
import { Domain } from "$/domain/entities/Domain";
import _c from "$/domain/entities/generic/Collection";
import { Future } from "$/domain/entities/generic/Future";
import { OrganisationUnitSummary } from "$/domain/entities/OrganisationUnitSummary";
import { Id } from "$/domain/entities/Ref";
import { OrganisationUnitRepository } from "$/domain/repositories/OrganisationUnitRepository";
import { ReportRepository } from "$/domain/repositories/ReportRepository";

export class GetAllReportsByDomainForOrgUnitUseCase {
    constructor(
        private options: {
            reportRepository: ReportRepository;
            organisationUnitRepository: OrganisationUnitRepository;
        }
    ) {}

    public execute(options: {
        domains: Domain[];
        orgUnitId: Id;
    }): FutureData<OrganisationUnitSummary> {
        return Future.joinObj({
            reports: this.options.reportRepository.get({ ...options, orgUnitMode: "SELECTED" }),
            organisationUnits: this.options.organisationUnitRepository.getByIds([
                options.orgUnitId,
            ]),
        }).map(({ reports, organisationUnits }) => {
            const organisationUnit = organisationUnits[0];
            if (!organisationUnit) {
                throw new Error(`Organisation unit with id ${options.orgUnitId} not found`);
            }
            const list = options.domains.map(domain => ({
                domain,
                reports: _c(reports)
                    .filter(report => report.domainId === domain.id)
                    .toArray(),
            }));
            return new OrganisationUnitSummary(organisationUnit, list);
        });
    }
}
