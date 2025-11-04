import { Id } from "$/domain/entities/Ref";
import i18n from "$/utils/i18n";
import { AnswerListWithScores } from "$/webapp/components/answer-scores/AnswerListWithScores";
import { Layout } from "$/webapp/components/layout/Layout";
import { Loading } from "$/webapp/components/loading/Loading";
import { ReportOverview } from "$/webapp/components/report-overview/ReportOverview";
import { useReportWithPrevious } from "$/webapp/hooks/useReportWithPrevious";
import { NoticeBox } from "@dhis2/ui";
import React from "react";

export interface DetailsProps {
    reportId: Id;
}

export const DetailsPage: React.FC<DetailsProps> = ({ reportId }: DetailsProps) => {
    const { loader } = useReportWithPrevious(reportId);
    const defaultTitle = "Details";
    if (loader.type === "loading") {
        return (
            <Layout title={defaultTitle} withGoBack>
                <Loading message={i18n.t("Loading report details...")} />
            </Layout>
        );
    }
    if (loader.type === "error") {
        return (
            <Layout title={defaultTitle} withGoBack>
                <NoticeBox title={i18n.t("Error loading summary")} error>
                    {i18n.t("An error occurred while loading the report.")}
                    <pre>{loader.message}</pre>
                </NoticeBox>
            </Layout>
        );
    }
    if (loader.type === "loaded" && !loader.value) {
        return (
            <Layout title={defaultTitle} withGoBack>
                <NoticeBox title={i18n.t("Report not found")} warning>
                    {i18n.t("The requested report does not exist.")}
                </NoticeBox>
            </Layout>
        );
    }
    if (loader.type === "loaded" && loader.value) {
        const value = loader.value;
        const title = i18n.t("Details for {{domain}}", { domain: value.report.domainName });
        return (
            <Layout title={title} withGoBack>
                <ReportOverview report={value.report} />
                <AnswerListWithScores current={value.report} previous={value.previous} />
            </Layout>
        );
    }
};
