import React from "react";
import { NoticeBox } from "@dhis2/ui";
import { Layout } from "$/webapp/components/layout/Layout";
import i18n from "$/utils/i18n";

export const UnauthorizedPage: React.FC = () => {
    return (
        <Layout title={i18n.t("Unauthorized")}>
            <NoticeBox title={i18n.t("Access Denied")} warning>
                {i18n.t(
                    "You do not have the necessary permissions to access this application. Please contact your system administrator for assistance."
                )}
            </NoticeBox>
        </Layout>
    );
};
