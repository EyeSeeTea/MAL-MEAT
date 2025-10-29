import React from "react";
import { useHistory } from "react-router-dom";
import { ObjectsTable, TableColumn, TableAction } from "@eyeseetea/d2-ui-components";
import EditIcon from "@material-ui/icons/Edit";
import DescriptionIcon from "@material-ui/icons/Description";
import AssessmentIcon from "@material-ui/icons/Assessment";
import { NoticeBox } from "@dhis2/ui";
import i18n from "$/utils/i18n";
import { ReportSummary } from "$/domain/entities/ReportSummary";
import { useReports } from "$/webapp/hooks/useReports";
import { useDomainsContext } from "$/webapp/contexts/domains-context";
import { useGetCaptureUrl } from "$/webapp/hooks/useGetCaptureUrl";
import { ReportFilters } from "$/webapp/components/report-filters/ReportFilters";
import { useReportFilters } from "$/webapp/hooks/useReportFilters";
import { getIdFromPath } from "$/domain/entities/OrganisationUnit";
import { Layout } from "$/webapp/components/layout/Layout";

export const ReportListPage: React.FC = () => {
    const pageTitle = i18n.t("Audit details");
    const history = useHistory();
    const getCaptureUrl = useGetCaptureUrl();
    const { fetch, loading: loadingReports, reports } = useReports();
    const { filters, updateFilters, resetFilters } = useReportFilters();
    const {
        domains: allDomains,
        loading: loadingDomains,
        error: domainsError,
    } = useDomainsContext();

    React.useEffect(() => {
        if (loadingDomains || allDomains.length === 0) return;
        const selectedDomains = filters.domainId
            ? allDomains.filter(d => d.id === filters.domainId)
            : allDomains;

        fetch({
            domains: selectedDomains,
            orgUnitId: filters.orgUnitPath ? getIdFromPath(filters.orgUnitPath) : undefined,
            year: filters.year,
            levelOfAudit: filters.levelOfAudit,
        });
    }, [fetch, allDomains, loadingDomains, filters]);

    const summaries = React.useMemo(
        () => reports.map(report => new ReportSummary(report)),
        [reports]
    );

    const editReport = (reportIds: string[]) => {
        if (reportIds.length !== 1 || !reportIds[0]) return;
        const captureUrl = getCaptureUrl(reportIds[0]);
        window.open(captureUrl, "_blank");
    };

    const showSummaryReport = (reportIds: string[]) => {
        if (reportIds.length !== 1) return;
        const report = reports.find(r => r.id === reportIds[0]);
        if (!report) return;
        history.push(`/summary/${report.organisationUnit.id}`);
    };

    const showDetailedReport = (reportIds: string[]) => {
        if (reportIds.length !== 1) return;
        history.push(`/details/${reportIds[0]}`);
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
        <Layout title={pageTitle}>
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
                filterComponents={
                    <ReportFilters
                        domains={allDomains}
                        selectedDomainId={filters.domainId}
                        selectedOrgUnit={filters.orgUnitPath}
                        selectedYear={filters.year}
                        selectedLevelOfAudit={filters.levelOfAudit}
                        onDomainChange={domainId => updateFilters({ domainId })}
                        onOrgUnitChange={orgUnitPath => updateFilters({ orgUnitPath })}
                        onYearChange={year => updateFilters({ year })}
                        onLevelOfAuditChange={levelOfAudit => updateFilters({ levelOfAudit })}
                        onReset={resetFilters}
                    />
                }
            />
        </Layout>
    );
};
