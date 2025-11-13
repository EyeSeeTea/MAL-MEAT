import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { HeaderBar } from "@dhis2/ui";
import { SnackbarProvider } from "@eyeseetea/d2-ui-components";
import { Feedback } from "@eyeseetea/feedback-component";
import { MuiThemeProvider } from "@material-ui/core/styles";
//@ts-ignore
import OldMuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import { appConfig } from "$/app-config";
import { CompositionRoot } from "$/CompositionRoot";
import { Share } from "$/webapp/components/share/Share";
import { AppContext, AppContextState } from "$/webapp/contexts/app-context";
import { Router } from "$/webapp/pages/Router";
import "./App.css";
import muiThemeLegacy from "./themes/dhis2-legacy.theme";
import { muiTheme } from "./themes/dhis2.theme";
import { DomainsProvider } from "$/webapp/components/providers/DomainProvider";
import { D2Api } from "$/types/d2-api";

type AppProps = {
    compositionRoot: CompositionRoot;
    api: D2Api;
};

function App_(props: AppProps) {
    const { compositionRoot, api } = props;
    const [showShareButton, setShowShareButton] = useState(false);
    const [loading, setLoading] = useState(true);
    const [appContext, setAppContext] = useState<AppContextState | null>(null);

    useEffect(() => {
        async function setup() {
            const isShareButtonVisible = appConfig.appearance.showShareButton;
            const currentUser = await compositionRoot.users.getCurrent.execute().toPromise();
            if (!currentUser) throw new Error("User not logged in");

            setAppContext({ currentUser, compositionRoot, api });
            setShowShareButton(isShareButtonVisible);
            setLoading(false);
        }
        setup();
    }, [compositionRoot, api]);

    if (loading) return null;

    return (
        <MuiThemeProvider theme={muiTheme}>
            <OldMuiThemeProvider muiTheme={muiThemeLegacy}>
                <SnackbarProvider>
                    <StyledHeaderBar appName="MAL Meat Audit" />

                    {appConfig.feedback && appContext && (
                        <Feedback
                            options={appConfig.feedback}
                            username={appContext.currentUser.username}
                        />
                    )}

                    <div id="app" className="content">
                        <AppContext.Provider value={appContext}>
                            <DomainsProvider>
                                <Router />
                            </DomainsProvider>
                        </AppContext.Provider>
                    </div>

                    <Share visible={showShareButton} />
                </SnackbarProvider>
            </OldMuiThemeProvider>
        </MuiThemeProvider>
    );
}

const StyledHeaderBar = styled(HeaderBar)`
    div:first-of-type {
        box-sizing: border-box;
    }
`;

export const App = React.memo(App_);
