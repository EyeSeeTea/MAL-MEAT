import { Report } from "$/domain/entities/Report";
import { useAppContext } from "$/webapp/contexts/app-context";
import React from "react";

export function useReports() {
    const { compositionRoot } = useAppContext();
    const [loading, setLoading] = React.useState(false);
    const [reports, setReports] = React.useState<Report[]>([]);

    const fetch = React.useCallback(() => {
        setLoading(true);
        compositionRoot.reports.getList.execute().run(
            reports => {
                console.debug("Fetched reports:", reports);
                setReports(reports);
                setLoading(false);
            },
            error => {
                console.error("Error fetching reports:", error);
                setReports([]);
                setLoading(false);
            }
        );
    }, [compositionRoot]);

    return { fetch, loading, reports };
}
