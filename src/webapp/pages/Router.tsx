import React from "react";
import { HashRouter, Route, Switch } from "react-router-dom";
import { ExamplePage } from "./example/ExamplePage";
import { ReportListPage } from "./report-list/ReportListPage";
import { DetailsPage } from "$/webapp/pages/details/DetailsPage";
import { SummaryPage } from "$/webapp/pages/summary/SummaryPage";

export function Router() {
    return (
        <HashRouter>
            <Switch>
                <Route
                    path="/for/:name?"
                    render={({ match }) => <ExamplePage name={match.params.name ?? "Stranger"} />}
                />
                <Route
                    path="/details/:reportId"
                    render={({ match }) => <DetailsPage reportId={match.params.reportId} />}
                />
                <Route
                    path="/summary/:orgUnitId"
                    render={({ match }) => <SummaryPage orgUnitId={match.params.orgUnitId} />}
                />
                {/* Default route */}
                <Route render={() => <ReportListPage />} />
            </Switch>
        </HashRouter>
    );
}
