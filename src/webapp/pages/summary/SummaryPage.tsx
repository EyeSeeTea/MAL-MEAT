import { Id } from "$/domain/entities/Ref";
import i18n from "$/utils/i18n";
import { AveragesSummary } from "$/webapp/components/averages-summary/AveragesSummary";
import { Layout } from "$/webapp/components/layout/Layout";
import { Loading } from "$/webapp/components/loading/Loading";
import { NonConformitiesSummary } from "$/webapp/components/non-conformities-summary/NonConformitiesSummary";
import { PerformanceOverTimeChart } from "$/webapp/components/performance-over-time-chart/PerformanceOverTimeChart";
import { useReportsByDomainForOrgUnit } from "$/webapp/hooks/useReportsByDomainForOrgUnit";
import { NoticeBox } from "@dhis2/ui";
import React from "react";
import styled from "styled-components";

export interface SummaryProps {
    orgUnitId: Id;
}

export const SummaryPage: React.FC<SummaryProps> = ({ orgUnitId }: SummaryProps) => {
    const defaultPageTitle = i18n.t("Summary");
    const { loader } = useReportsByDomainForOrgUnit(orgUnitId);
    const [expanded, setExpanded] = React.useState(false);

    const handleToggleExpanded = () => {
        setExpanded(!expanded);
    };

    if (loader.type === "loading") {
        return (
            <Layout title={defaultPageTitle} withGoBack>
                <Loading message={i18n.t("Loading summary...")} />
            </Layout>
        );
    }
    if (loader.type === "error") {
        return (
            <Layout title={defaultPageTitle} withGoBack>
                <NoticeBox title={i18n.t("Error loading summary")} error>
                    {i18n.t("An error occurred while loading the summary.")}
                    <pre>{loader.message}</pre>
                </NoticeBox>
            </Layout>
        );
    }
    const { value } = loader;
    const pageTitle = i18n.t("Summary for {{orgUnitName}}", {
        orgUnitName: value.organisationUnit.name,
    });

    return (
        <Layout title={pageTitle} withGoBack>
            <SummariesContainer>
                <NonConformitiesSummary
                    summary={value}
                    expanded={expanded}
                    onToggle={handleToggleExpanded}
                />
                <AveragesSummary
                    summary={value}
                    expanded={expanded}
                    onToggle={handleToggleExpanded}
                />
            </SummariesContainer>
            <PerformanceOverTimeChart summary={value} />
        </Layout>
    );
};

const SummariesContainer = styled.div`
    display: flex;
    gap: 1rem;
`;
