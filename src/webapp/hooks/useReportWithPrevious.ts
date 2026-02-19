import { isDomainType } from "$/domain/entities/Domain";
import { Future } from "$/domain/entities/generic/Future";
import { Id } from "$/domain/entities/Ref";
import { Report } from "$/domain/entities/Report";
import { useDomainsContext } from "$/webapp/contexts/domains-context";
import { useLoader } from "$/webapp/hooks/useLoader";
import React from "react";

export function useReportWithPrevious(reportId: Id, domainType: string) {
    const { domains, loading: domainsLoading } = useDomainsContext();
    const loader = useLoader<{
        report: Report;
        previous: Report[];
    } | null>(
        React.useCallback(
            compositionRoot => {
                if (domainsLoading) {
                    return;
                }
                if (isDomainType(domainType)) {
                    return compositionRoot.reports.getByIdWithPrevious.execute({
                        reportId,
                        domainType,
                        domains,
                    });
                } else {
                    return Future.error(new Error(`Invalid domain type: ${domainType}`));
                }
            },
            [reportId, domainType, domains, domainsLoading]
        )
    );
    return {
        loader,
    };
}
