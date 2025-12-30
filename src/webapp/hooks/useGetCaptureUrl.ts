import React from "react";
import { useConfig } from "@dhis2/app-runtime";

export function useGetCaptureUrl(): (reportId: string) => string {
    const config = useConfig();

    return React.useCallback(
        (reportId: string) => {
            const baseUrl = import.meta.env.DEV
                ? import.meta.env.VITE_DHIS2_BASE_URL || config.baseUrl
                : config.baseUrl;
            const normalizedBaseUrl = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
            return `${normalizedBaseUrl}/dhis-web-capture/index.html#/viewEvent?viewEventId=${reportId}`;
        },
        [config]
    );
}
