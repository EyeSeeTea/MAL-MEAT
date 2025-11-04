import { OrganisationUnitSummary } from "$/domain/entities/OrganisationUnitSummary";
import i18n from "$/utils/i18n";
import {
    Card as MUICard,
    CardContent as MUICardContent,
    Collapse,
    IconButton,
} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import React from "react";
import styled from "styled-components";
import { NonConformitiesBadge } from "$/webapp/components/numeric-badge/NonConformitiesBadge";

export interface NonConformitiesSummaryProps {
    summary: OrganisationUnitSummary;
    expanded?: boolean;
    onToggle?: () => void;
}

export const NonConformitiesSummary: React.FC<NonConformitiesSummaryProps> = ({
    summary,
    expanded: controlledExpanded,
    onToggle,
}: NonConformitiesSummaryProps) => {
    const [internalExpanded, setInternalExpanded] = React.useState(false);

    const expanded = controlledExpanded !== undefined ? controlledExpanded : internalExpanded;

    const handleExpandClick = () => {
        if (onToggle) {
            onToggle();
        } else {
            setInternalExpanded(!internalExpanded);
        }
    };

    return (
        <Card>
            <CardMain onClick={handleExpandClick}>
                <MetricContainer>
                    <NonConformitiesBadge value={summary.totalMajorNonconformities} large />
                    <MetricLabel>{i18n.t("Total major non-conformities")}</MetricLabel>
                </MetricContainer>
                <ExpandIconContainer>
                    <ExpandButton
                        expanded={expanded}
                        aria-expanded={expanded}
                        aria-label={i18n.t("show more")}
                    >
                        <ExpandMoreIcon />
                    </ExpandButton>
                </ExpandIconContainer>
            </CardMain>
            <Collapse in={expanded} timeout="auto" unmountOnExit>
                <Content>
                    <DetailsTitle>{i18n.t("By Domain")}</DetailsTitle>
                    {summary.latestReportByDomain.length > 0 ? (
                        summary.latestReportByDomain.map(({ domain, report }) => {
                            return (
                                <DomainSection key={domain.id}>
                                    <NonConformitiesBadge value={report?.majorNonconformities} />
                                    <DomainName>
                                        {domain.name}
                                        {report?.date && <DateText> {report.date}</DateText>}
                                    </DomainName>
                                </DomainSection>
                            );
                        })
                    ) : (
                        <EmptyMessage>{i18n.t("No reports available")}</EmptyMessage>
                    )}
                </Content>
            </Collapse>
        </Card>
    );
};

const Card = styled(MUICard)`
    flex: 1;
    margin: 1rem 0;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const CardMain = styled.div`
    padding: 2rem;
    background-color: #fcfcfc;
    border-bottom: 1px solid #ddd;
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
    transition: border-color 0.2s, box-shadow 0.2s;

    &:hover {
        border-bottom-color: #3498db;
    }
`;

const MetricContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
`;

const MetricLabel = styled.div`
    font-size: 0.95rem;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: #666;
`;

const ExpandIconContainer = styled.div`
    display: flex;
    align-items: center;
`;

const Content = styled(MUICardContent)`
    padding: 1.5rem;
    background-color: #fafafa;
`;

const DetailsTitle = styled.h3`
    margin: 0 0 1rem 0;
    font-size: 0.875rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: #666;
`;

const DomainSection = styled.div`
    padding: 1rem;
    margin-bottom: 0.75rem;
    background-color: white;
    display: flex;
    align-items: center;
    gap: 1rem;
    border-radius: 4px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
    transition: box-shadow 0.2s;

    &:hover {
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.12);
    }

    &:last-child {
        margin-bottom: 0;
    }
`;

const DomainName = styled.div`
    font-size: 1rem;
    font-weight: 500;
    color: #333;
    flex: 1;
`;

const DateText = styled.span`
    font-size: 1rem;
    font-weight: 400;
    margin-left: 0.5rem;
    color: #999;
`;

const EmptyMessage = styled.p`
    margin: 0;
    padding: 2rem;
    text-align: center;
    color: #999;
    font-style: italic;
`;

interface ExpandButtonProps {
    expanded: boolean;
}

const ExpandButton = styled(IconButton)<ExpandButtonProps>`
    color: #666 !important;
    transform: ${({ expanded }) => (expanded ? "rotate(180deg)" : "rotate(0deg)")};
    transition: transform 0.3s;

    &:hover {
        background-color: rgba(0, 0, 0, 0.04) !important;
    }
`;
