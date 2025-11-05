import React from "react";
import { HashRouter, Route, Switch } from "react-router-dom";
import { ReportListPage } from "./report-list/ReportListPage";
import { DetailsPage } from "$/webapp/pages/details/DetailsPage";
import { SummaryPage } from "$/webapp/pages/summary/SummaryPage";
import { usePermissions } from "$/webapp/hooks/usePermissions";
import { UnauthorizedPage } from "$/webapp/pages/unauthorized/UnauthorizedPage";

export function Router() {
    const permissions = usePermissions();
    if (!permissions.APP_ACCESS) {
        return <UnauthorizedPage />;
    }
    return (
        <HashRouter>
            <Switch>
                {permissions.DETAILS_PAGE && (
                    <Route
                        path="/details/:reportId"
                        render={({ match }) => <DetailsPage reportId={match.params.reportId} />}
                    />
                )}
                {permissions.SUMMARY_PAGE && (
                    <Route
                        path="/summary/:orgUnitId"
                        render={({ match }) => <SummaryPage orgUnitId={match.params.orgUnitId} />}
                    />
                )}
                {permissions.REPORT_LIST_PAGE && (
                    <Route path="/" render={() => <ReportListPage />} />
                )}
            </Switch>
        </HashRouter>
    );
}
