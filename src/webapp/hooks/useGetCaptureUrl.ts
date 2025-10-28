import React from "react";
import { useConfig } from "@dhis2/app-runtime";

export function useGetCaptureUrl(): (reportId: string) => string {
    const config = useConfig();

    return React.useCallback(
        (reportId: string) => {
            if (import.meta.env.DEV) {
                const baseUrl = import.meta.env.VITE_DHIS2_BASE_URL || config.baseUrl;
                return `${baseUrl}/dhis-web-capture/index.html#/viewEvent?viewEventId=${reportId}`;
            }
            return `${config.baseUrl}/dhis-web-capture/index.html#/viewEvent?viewEventId=${reportId}`;
        },
        [config]
    );
}
