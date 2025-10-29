import { FutureData } from "$/data/api-futures";
import { Domain } from "$/domain/entities/Domain";
import _c from "$/domain/entities/generic/Collection";
import { Future } from "$/domain/entities/generic/Future";
import { OrganisationUnit } from "$/domain/entities/OrganisationUnit";
import { Id } from "$/domain/entities/Ref";
import { Report } from "$/domain/entities/Report";
import { OrganisationUnitRepository } from "$/domain/repositories/OrganisationUnitRepository";
import { ReportRepository } from "$/domain/repositories/ReportRepository";

type ReportsByDomain = {
    domain: Domain;
    reports: Report[];
};

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
    }): FutureData<{ organisationUnit: OrganisationUnit; list: ReportsByDomain[] }> {
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
            return {
                organisationUnit,
                list,
            };
        });
    }
}
