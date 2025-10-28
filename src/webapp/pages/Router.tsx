import React from "react";
import { HashRouter, Route, Switch } from "react-router-dom";
import { ExamplePage } from "./example/ExamplePage";
import { ReportList } from "./report-list/ReportList";
import { Details } from "$/webapp/pages/details/Details";

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
                    render={({ match }) => <Details reportId={match.params.reportId} />}
                />
                {/* Default route */}
                <Route render={() => <ReportList />} />
            </Switch>
        </HashRouter>
    );
}
