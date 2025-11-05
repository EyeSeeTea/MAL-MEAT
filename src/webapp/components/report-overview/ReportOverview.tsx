import { Report } from "$/domain/entities/Report";
import { ReportSummary } from "$/domain/entities/ReportSummary";
import i18n from "$/utils/i18n";
import { Card as MUICard } from "@material-ui/core";
import React from "react";
import styled from "styled-components";
import { NonConformitiesBadge } from "$/webapp/components/numeric-badge/NonConformitiesBadge";
import { ScoreBadge } from "$/webapp/components/numeric-badge/ScoreBadge";
import { usePermissions } from "$/webapp/hooks/usePermissions";
import { useGetCaptureUrl } from "$/webapp/hooks/useGetCaptureUrl";
import { Launch as LaunchIcon } from "@material-ui/icons";

export interface ReportOverviewProps {
    report: Report;
}

export const ReportOverview: React.FC<ReportOverviewProps> = ({ report }: ReportOverviewProps) => {
    const reportSummary = React.useMemo(() => new ReportSummary(report), [report]);
    const permissions = usePermissions();
    const getCaptureUrl = useGetCaptureUrl();

    const formatDate = (date: Date): string => {
        return date.toISOString().split("T")[0] as string;
    };

    return (
        <Card>
            <CardHeader>
                <HeaderTitle>{i18n.t("Report Overview")}</HeaderTitle>
                {permissions.EDIT && (
                    <ExternalLink
                        href={getCaptureUrl(report.id)}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <LaunchIcon fontSize="small" />
                        {i18n.t("Edit in Capture")}
                    </ExternalLink>
                )}
            </CardHeader>
            <CardBody>
                <DetailsGrid>
                    <DetailItem>
                        <DetailLabel>{i18n.t("Domain")}:</DetailLabel>
                        <DetailValue>{report.domainName}</DetailValue>
                    </DetailItem>

                    <DetailItem>
                        <DetailLabel>{i18n.t("Date")}:</DetailLabel>
                        <DetailValue>{formatDate(report.date)}</DetailValue>
                    </DetailItem>

                    <DetailItem>
                        <DetailLabel>{i18n.t("Organisation Unit")}:</DetailLabel>
                        <DetailValue>{report.organisationUnit.name}</DetailValue>
                    </DetailItem>

                    {report.audit.level && (
                        <DetailItem>
                            <DetailLabel>{i18n.t("Audit Level")}:</DetailLabel>
                            <DetailValue>{report.audit.level.name}</DetailValue>
                        </DetailItem>
                    )}

                    {report.audit.type && (
                        <DetailItem>
                            <DetailLabel>{i18n.t("Audit Type")}:</DetailLabel>
                            <DetailValue>{report.audit.type.name}</DetailValue>
                        </DetailItem>
                    )}
                </DetailsGrid>
                <MetricsSection>
                    <MetricContainer>
                        <NonConformitiesBadge value={reportSummary.majorNonconformities} large />
                        <MetricLabel>{i18n.t("Major non-conformities")}</MetricLabel>
                    </MetricContainer>
                    <MetricContainer>
                        <ScoreBadge value={reportSummary.averageScore} large />
                        <MetricLabel>{i18n.t("Average score")}</MetricLabel>
                    </MetricContainer>
                </MetricsSection>
            </CardBody>
        </Card>
    );
};

const Card = styled(MUICard)`
    margin: 1rem 0 2rem 0;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const CardHeader = styled.div`
    padding: 1.5rem 2rem;
    background-color: #3498db;
    color: white;
    border-bottom: 1px solid #2980b9;
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

const HeaderTitle = styled.h2`
    margin: 0;
    font-size: 1.5rem;
    font-weight: 500;
`;

const ExternalLink = styled.a`
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: white;
    text-decoration: none;
    font-size: 0.9rem;
    font-weight: 500;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    background-color: rgba(255, 255, 255, 0.15);
    transition: background-color 0.2s ease;

    &:hover {
        background-color: rgba(255, 255, 255, 0.25);
    }

    svg {
        font-size: 1rem;
    }
`;

const CardBody = styled.div`
    padding: 2rem;
    background-color: #fcfcfc;
`;

const DetailsGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1.5rem;
`;

const DetailItem = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
`;

const DetailLabel = styled.span`
    font-weight: 600;
    color: #555;
    font-size: 0.875rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
`;

const DetailValue = styled.span`
    font-size: 1rem;
    color: #333;
    word-break: break-word;
`;

const MetricsSection = styled.div`
    display: flex;
    gap: 2rem;
    margin-top: 2rem;
    flex-wrap: wrap;
    padding: 1rem 0;
    border-top: 1px solid #e0e0e0;
`;

const MetricContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
`;

const MetricLabel = styled.span`
    font-weight: 500;
    color: #555;
    font-size: 0.9rem;
    text-align: center;
`;
