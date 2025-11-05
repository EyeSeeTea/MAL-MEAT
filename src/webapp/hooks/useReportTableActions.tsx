import { ReportSummary } from "$/domain/entities/ReportSummary";
import { TableAction } from "@eyeseetea/d2-ui-components";
import i18n from "$/utils/i18n";
import { useHistory } from "react-router-dom";
import { useGetCaptureUrl } from "$/webapp/hooks/useGetCaptureUrl";
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
    const getCaptureUrl = useGetCaptureUrl();
    const permissions = usePermissions();

    const editReport = React.useCallback(
        (reportIds: string[]) => {
            if (reportIds.length !== 1 || !reportIds[0]) return;
            const captureUrl = getCaptureUrl(reportIds[0]);
            window.open(captureUrl, "_blank");
        },
        [getCaptureUrl]
    );

    const showSummaryReport = React.useCallback(
        (reportIds: string[]) => {
            if (reportIds.length !== 1) return;
            const report = reports.find(r => r.id === reportIds[0]);
            if (!report) return;
            history.push(`/summary/${report.organisationUnit.id}`);
        },
        [history, reports]
    );

    const showDetailedReport = React.useCallback(
        (reportIds: string[]) => {
            if (reportIds.length !== 1) return;
            history.push(`/details/${reportIds[0]}`);
        },
        [history]
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
