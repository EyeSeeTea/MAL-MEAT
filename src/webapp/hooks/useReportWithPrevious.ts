import { Id } from "$/domain/entities/Ref";
import { useDomainsContext } from "$/webapp/contexts/domains-context";
import { useLoader } from "$/webapp/hooks/useLoader";
import React from "react";

export function useReportWithPrevious(reportId: Id) {
    const { domains, loading: domainsLoading } = useDomainsContext();
    const loader = useLoader(
        React.useCallback(
            compositionRoot => {
                if (domainsLoading) {
                    return;
                }
                return compositionRoot.reports.getByIdWithPrevious.execute({ reportId, domains });
            },
            [reportId, domains, domainsLoading]
        )
    );
    return {
        loader,
    };
}
