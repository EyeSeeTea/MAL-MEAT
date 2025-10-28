import { Id } from "$/domain/entities/Ref";
import i18n from "$/utils/i18n";
import { AnswerListWithScores } from "$/webapp/components/answer-scores/AnswerListWithScores";
import { PageHeader } from "$/webapp/components/page-header/PageHeader";
import { useReportWithPrevious } from "$/webapp/hooks/useReportWithPrevious";
import { NoticeBox } from "@dhis2/ui";
import { CircularProgress } from "@material-ui/core";
import React, { ReactNode } from "react";
import { useHistory } from "react-router-dom";
import styled from "styled-components";

export interface DetailsProps {
    reportId: Id;
}

export const Details: React.FC<DetailsProps> = ({ reportId }: DetailsProps) => {
    const { loader } = useReportWithPrevious(reportId);
    if (loader.type === "loading") {
        return (
            <BaseLayout>
                <LoadingContainer>
                    <CircularProgress size={60} thickness={4} />
                    <LoadingText>{i18n.t("Loading report details...")}</LoadingText>
                </LoadingContainer>
            </BaseLayout>
        );
    }
    if (loader.type === "error") {
        return (
            <BaseLayout>
                <NoticeBox title={i18n.t("Error loading summary")} error>
                    {i18n.t("An error occurred while loading the report.")}
                    <pre>{loader.message}</pre>
                </NoticeBox>
            </BaseLayout>
        );
    }
    if (loader.type === "loaded" && !loader.value) {
        return (
            <BaseLayout>
                <NoticeBox title={i18n.t("Report not found")} warning>
                    {i18n.t("The requested report does not exist.")}
                </NoticeBox>
            </BaseLayout>
        );
    }
    if (loader.type === "loaded" && loader.value) {
        const value = loader.value;
        const title = i18n.t("Details for {{domain}}", { domain: value.report.domainName });
        return (
            <BaseLayout title={title}>
                <AnswerListWithScores current={value.report} previous={value.previous} />
            </BaseLayout>
        );
    }
};

const BaseLayout: React.FC<{ children: ReactNode; title?: string }> = ({ children, title }) => {
    const history = useHistory();

    const goBack = React.useCallback(() => {
        history.goBack();
    }, [history]);
    return (
        <Container>
            <PageHeader title={title ?? i18n.t("Details")} onBackClick={goBack} />
            {children}
        </Container>
    );
};

const Container = styled.div`
    padding: 2rem;
`;

const LoadingContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 300px;
    gap: 1.5rem;
`;

const LoadingText = styled.div`
    font-size: 1.1rem;
    color: #666;
    font-weight: 500;
`;
