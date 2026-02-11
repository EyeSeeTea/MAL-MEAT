import { ReportSummary } from "$/domain/entities/ReportSummary";
import { TableAction } from "@eyeseetea/d2-ui-components";
import i18n from "$/utils/i18n";
import { useHistory } from "react-router-dom";
import { useGetCaptureUrlViewEvent } from "$/webapp/hooks/useGetCaptureUrl";
import { Report } from "$/domain/entities/Report";
import EditIcon from "@material-ui/icons/Edit";
import DescriptionIcon from "@material-ui/icons/Description";
import AssessmentIcon from "@material-ui/icons/Assessment";
import { usePermissions } from "$/webapp/hooks/usePermissions";
import React from "react";

export function useReportTableActions(reports: Report[]): {
    actions: TableAction<ReportSummary>[];
} {
    const history = useHistory();
    const getCaptureUrl = useGetCaptureUrlViewEvent();
    const permissions = usePermissions();

    const findReportById = React.useCallback(
        (rowId: string | undefined) => {
            if (!rowId) return;
            const [eventId, domainType] = rowId.split("-");
            if (!eventId || !domainType) return;
            return reports.find(r => r.id === eventId && r.domainType === domainType);
        },
        [reports]
    );

    const editReport = React.useCallback(
        (reportIds: string[]) => {
            const report = findReportById(reportIds[0]);
            if (!report) return;
            const captureUrl = getCaptureUrl(report.id);
            window.open(captureUrl, "_blank");
        },
        [getCaptureUrl, findReportById]
    );

    const showSummaryReport = React.useCallback(
        (reportIds: string[]) => {
            const report = findReportById(reportIds[0]);
            if (!report) return;
            history.push(`/summary/${report.organisationUnit.id}`);
        },
        [history, findReportById]
    );

    const showDetailedReport = React.useCallback(
        (reportIds: string[]) => {
            const report = findReportById(reportIds[0]);
            if (!report) return;
            history.push(`/details/${report.id}/${report.domainType}`);
        },
        [history, findReportById]
    );

    const actions = React.useMemo(() => {
        const editAction: TableAction<ReportSummary> = {
            name: "edit",
            text: i18n.t("Edit"),
            multiple: false,
            onClick: editReport,
            icon: <EditIcon />,
        };
        const showSummaryAction: TableAction<ReportSummary> = {
            name: "showSummary",
            text: i18n.t("Show Summary Report"),
            multiple: false,
            onClick: showSummaryReport,
            icon: <DescriptionIcon />,
        };
        const showDetailsAction: TableAction<ReportSummary> = {
            name: "showDetailed",
            text: i18n.t("Show Detailed Report"),
            multiple: false,
            onClick: showDetailedReport,
            icon: <AssessmentIcon />,
            primary: true,
        };
        const actions: TableAction<ReportSummary>[] = [];
        if (permissions.DETAILS_PAGE) {
            actions.push(showDetailsAction);
        }
        if (permissions.EDIT) {
            actions.push(editAction);
        }
        if (permissions.SUMMARY_PAGE) {
            actions.push(showSummaryAction);
        }
        return actions;
    }, [
        editReport,
        showSummaryReport,
        showDetailedReport,
        permissions.SUMMARY_PAGE,
        permissions.EDIT,
        permissions.DETAILS_PAGE,
    ]);

    return { actions };
}
