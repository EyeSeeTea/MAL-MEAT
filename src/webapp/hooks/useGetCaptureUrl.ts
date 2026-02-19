import React from "react";
import { useConfig } from "@dhis2/app-runtime";
import { useDomainsContext } from "$/webapp/contexts/domains-context";

function getNormalizedBaseUrl(config: { baseUrl: string }): string {
    const baseUrl = import.meta.env.DEV
        ? import.meta.env.VITE_DHIS2_BASE_URL || config.baseUrl
        : config.baseUrl;
    return baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
}

export function useGetCaptureUrlViewEvent(): (reportId: string) => string {
    const config = useConfig();

    return React.useCallback(
        (reportId: string) => {
            const normalizedBaseUrl = getNormalizedBaseUrl(config);
            return `${normalizedBaseUrl}/dhis-web-capture/index.html#/viewEvent?viewEventId=${reportId}`;
        },
        [config]
    );
}

export function useCaptureUrlNewReport(): string {
    const config = useConfig();
    const { domains } = useDomainsContext();
    return React.useMemo(() => {
        if (!domains[0]) {
            return "";
        }
        const normalizedBaseUrl = getNormalizedBaseUrl(config);
        // all domains have the same id
        return `${normalizedBaseUrl}/dhis-web-capture/index.html#/new?programId=${domains[0].id}`;
    }, [config, domains]);
}
