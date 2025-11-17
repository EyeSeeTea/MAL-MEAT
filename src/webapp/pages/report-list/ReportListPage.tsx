import React from "react";
import { ObjectsTable, TableColumn } from "@eyeseetea/d2-ui-components";
import { NoticeBox } from "@dhis2/ui";
import i18n from "$/utils/i18n";
import { ReportSummary } from "$/domain/entities/ReportSummary";
import { useReports } from "$/webapp/hooks/useReports";
import { useDomainsContext } from "$/webapp/contexts/domains-context";
import { ReportFilters } from "$/webapp/components/report-filters/ReportFilters";
import { PagingState, useReportFilters } from "$/webapp/hooks/useReportFilters";
import { getIdFromPath } from "$/domain/entities/OrganisationUnit";
import { Layout } from "$/webapp/components/layout/Layout";
import { useReportTableActions } from "$/webapp/hooks/useReportTableActions";

export const ReportListPage: React.FC = () => {
    const pageTitle = i18n.t("Audit details");
    const { fetch, loading: loadingReports, reports } = useReports();
    const { filters, paging, updateFilters, updatePaging, resetFilters } = useReportFilters();
    const {
        domains: allDomains,
        loading: loadingDomains,
        error: domainsError,
    } = useDomainsContext();
    const { actions } = useReportTableActions(reports);

    React.useEffect(() => {
        if (loadingDomains || allDomains.length === 0) return;
        const selectedDomains = filters.domainId
            ? allDomains.filter(d => d.id === filters.domainId)
            : allDomains;
        updatePaging({ page: 1 }); // reset to first page on filter change
        fetch({
            domains: selectedDomains,
            orgUnitId: filters.orgUnitPath ? getIdFromPath(filters.orgUnitPath) : undefined,
            year: filters.year,
            levelOfAudit: filters.levelOfAudit,
        });
    }, [fetch, allDomains, loadingDomains, filters, updatePaging]);

    const summaries = React.useMemo(() => {
        const summaries = reports.map(report => new ReportSummary(report));
        // TODO: filter and paging should be applied in the repository layer
        // implemented at view level because repo does not support paging over multiple programs
        return sortAndPageSummaries(summaries, paging);
    }, [paging, reports]);

    const handleTableChange = React.useCallback(
        (state: {
            pagination: { page: number; pageSize: number };
            sorting: { field: string; order: "asc" | "desc" };
        }) => {
            updatePaging({
                page: state.pagination.page,
                rowsPerPage: state.pagination.pageSize,
                sortField: state.sorting.field,
                sortOrder: state.sorting.order,
            });
        },
        [updatePaging]
    );

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
            getValue: (summary: ReportSummary) => {
                return summary.date;
            },
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
            getValue: (summary: ReportSummary) => `${summary.averageScore.toFixed(2)} %`,
        },
        {
            name: "majorNonconformities" as const,
            text: i18n.t("Major Nonconformities"),
            sortable: true,
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
                pagination={{
                    page: paging.page,
                    pageSize: paging.rowsPerPage,
                    total: reports.length,
                }}
                sorting={
                    paging.sortField && paging.sortOrder
                        ? {
                              field: paging.sortField as keyof ReportSummary,
                              order: paging.sortOrder,
                          }
                        : undefined
                }
                onChange={handleTableChange}
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

function sortAndPageSummaries(summaries: ReportSummary[], paging: PagingState): ReportSummary[] {
    if (!paging.sortField || !paging.sortOrder) {
        return summaries;
    }
    const sortedSummaries = [...summaries].sort((a, b) => {
        const field = paging.sortField as keyof ReportSummary;
        const aValue = a[field];
        const bValue = b[field];

        if (aValue < bValue) return paging.sortOrder === "asc" ? -1 : 1;
        if (aValue > bValue) return paging.sortOrder === "asc" ? 1 : -1;
        return 0;
    });
    const startIndex = (paging.page - 1) * paging.rowsPerPage;
    const endIndex = startIndex + paging.rowsPerPage;
    return sortedSummaries.slice(startIndex, endIndex);
}
