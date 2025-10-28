import React from "react";
import { Id } from "$/domain/entities/Ref";
import { OrgUnitPath } from "$/domain/entities/OrganisationUnit";

export interface ReportFiltersState {
    domainId: Id | undefined;
    orgUnitPath: OrgUnitPath | undefined;
    year: number | undefined;
    levelOfAudit: string | undefined;
}

const defaultFilters: ReportFiltersState = {
    domainId: undefined,
    orgUnitPath: undefined,
    year: undefined,
    levelOfAudit: undefined,
};

export function useReportFilters() {
    const [filters, setFilters] = React.useState<ReportFiltersState>(defaultFilters);

    const updateFilters = React.useCallback((newFilters: Partial<ReportFiltersState>) => {
        setFilters(prev => ({ ...prev, ...newFilters }));
    }, []);

    const resetFilters = React.useCallback(() => {
        setFilters(defaultFilters);
    }, []);

    return {
        filters,
        updateFilters,
        resetFilters,
    };
}
