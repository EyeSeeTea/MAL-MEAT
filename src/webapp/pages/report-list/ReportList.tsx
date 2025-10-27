import React from "react";
import { ObjectsTable, TableColumn, TableAction } from "@eyeseetea/d2-ui-components";
import EditIcon from "@material-ui/icons/Edit";
import DescriptionIcon from "@material-ui/icons/Description";
import AssessmentIcon from "@material-ui/icons/Assessment";
import i18n from "$/utils/i18n";
import { useReports } from "$/webapp/hooks/useReports";
import { PageHeader } from "$/webapp/components/page-header/PageHeader";
import { useHistory } from "react-router-dom";
import { ReportSummary } from "$/domain/entities/ReportSummary";
import { useDomainsContext } from "$/webapp/contexts/domains-context";
import { NoticeBox } from "@dhis2/ui";

import styled from "styled-components";

export const ReportList: React.FC = () => {
    const history = useHistory();
    const { fetch, loading: loadingReports, reports } = useReports();
    const {
        domains: allDomains,
        loading: loadingDomains,
        error: domainsError,
    } = useDomainsContext();

    React.useEffect(() => {
        if (loadingDomains || allDomains.length === 0) return;
        fetch({ domains: allDomains });
    }, [fetch, allDomains, loadingDomains]);

    const summaries = React.useMemo(
        () => reports.map(report => new ReportSummary(report)),
        [reports]
    );

    const editReport = (reportIds: string[]) => {
        if (reportIds.length !== 1) return;
        history.push(`/report/${reportIds[0]}/edit`);
    };

    const showSummaryReport = (reportIds: string[]) => {
        if (reportIds.length !== 1) return;
        history.push(`/report/${reportIds[0]}/summary`);
    };

    const showDetailedReport = (reportIds: string[]) => {
        if (reportIds.length !== 1) return;
        history.push(`/report/${reportIds[0]}/detailed`);
    };

    const columns: TableColumn<ReportSummary>[] = [
        {
            name: "domain" as const,
            text: i18n.t("Domain"),
            sortable: true,
            getValue: (summary: ReportSummary) => {
                const domain = allDomains.find(d => d.id === summary.report.domainId);
                return domain?.name;
            },
        },
        {
            name: "date" as const,
            text: i18n.t("Report Date"),
            sortable: true,
        },
        {
            name: "organisationUnitName" as const,
            text: i18n.t("Organization Unit"),
            sortable: true,
        },
        {
            name: "auditLevel" as const,
            text: i18n.t("Level of Audit"),
            sortable: true,
        },
        {
            name: "averageScore" as const,
            text: i18n.t("Average Score"),
            sortable: true,
        },
        {
            name: "majorNonconformities" as const,
            text: i18n.t("Major Nonconformities"),
            sortable: true,
        },
    ];

    const actions: TableAction<ReportSummary>[] = [
        {
            name: "edit",
            text: i18n.t("Edit"),
            multiple: false,
            primary: true,
            onClick: editReport,
            icon: <EditIcon />,
        },
        {
            name: "showSummary",
            text: i18n.t("Show Summary Report"),
            multiple: false,
            onClick: showSummaryReport,
            icon: <DescriptionIcon />,
        },
        {
            name: "showDetailed",
            text: i18n.t("Show Detailed Report"),
            multiple: false,
            onClick: showDetailedReport,
            icon: <AssessmentIcon />,
        },
    ];

    return (
        <Container>
            <PageHeader title={i18n.t("Audit details")} />
            {domainsError && (
                <NoticeBox title={i18n.t("Error loading domain configuration")} error>
                    {i18n.t(
                        "There was an error loading the domains. Please review the metadata configuration or contact support."
                    )}
                    <pre>{domainsError}</pre>
                </NoticeBox>
            )}
            <ObjectsTable<ReportSummary>
                rows={summaries}
                columns={columns}
                actions={actions}
                loading={loadingReports}
            />
        </Container>
    );
};

const Container = styled.div`
    padding: 2rem;
`;
