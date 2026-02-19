import React from "react";
import { useHistory, useLocation } from "react-router-dom";
import { OrgUnitPath } from "$/domain/entities/OrganisationUnit";
import { DomainType, isDomainType } from "$/domain/entities/Domain";

export interface ReportFiltersState {
    domainType: DomainType | undefined;
    orgUnitPath: OrgUnitPath | undefined;
    year: number | undefined;
    levelOfAudit: string | undefined;
}

export interface PagingState {
    page: number;
    rowsPerPage: number;
    sortField: string | undefined;
    sortOrder: "asc" | "desc" | undefined;
}

const defaultFilters: ReportFiltersState = {
    domainType: undefined,
    orgUnitPath: undefined,
    year: undefined,
    levelOfAudit: undefined,
};

const defaultPaging: PagingState = {
    page: 1,
    rowsPerPage: 25,
    sortField: undefined,
    sortOrder: undefined,
};

function parseFiltersFromUrl(search: string): ReportFiltersState {
    const params = new URLSearchParams(search);

    const orgUnitPathStr = params.get("orgUnitPath");
    const yearStr = params.get("year");
    const domain = params.get("domainType");
    return {
        domainType: domain && isDomainType(domain) ? domain : undefined,
        orgUnitPath: orgUnitPathStr ? orgUnitPathStr.split(",") : undefined,
        year: yearStr ? parseInt(yearStr, 10) : undefined,
        levelOfAudit: params.get("levelOfAudit") || undefined,
    };
}

function parsePagingFromUrl(search: string): PagingState {
    const params = new URLSearchParams(search);

    const pageStr = params.get("page");
    const rowsPerPageStr = params.get("rowsPerPage");
    const sortOrder = params.get("sortOrder");

    return {
        page: pageStr ? parseInt(pageStr, 10) : defaultPaging.page,
        rowsPerPage: rowsPerPageStr ? parseInt(rowsPerPageStr, 10) : defaultPaging.rowsPerPage,
        sortField: params.get("sortField") || undefined,
        sortOrder: sortOrder === "asc" || sortOrder === "desc" ? sortOrder : undefined,
    };
}

function serializeToUrl(filters: ReportFiltersState, paging: PagingState): string {
    const params = new URLSearchParams();

    if (filters.domainType) params.set("domainType", filters.domainType);
    if (filters.orgUnitPath) params.set("orgUnitPath", filters.orgUnitPath.join(","));
    if (filters.year) params.set("year", filters.year.toString());
    if (filters.levelOfAudit) params.set("levelOfAudit", filters.levelOfAudit);

    if (paging.page !== defaultPaging.page) params.set("page", paging.page.toString());
    if (paging.rowsPerPage !== defaultPaging.rowsPerPage) {
        params.set("rowsPerPage", paging.rowsPerPage.toString());
    }

    if (paging.sortField) params.set("sortField", paging.sortField);
    if (paging.sortOrder) params.set("sortOrder", paging.sortOrder);

    return params.toString();
}

export function useReportFilters() {
    const location = useLocation();
    const history = useHistory();

    const [filters, setFilters] = React.useState<ReportFiltersState>(() => {
        return parseFiltersFromUrl(location.search);
    });

    const [paging, setPaging] = React.useState<PagingState>(() => {
        return parsePagingFromUrl(location.search);
    });

    const updateUrl = React.useCallback(
        (newFilters: ReportFiltersState, newPaging: PagingState) => {
            const queryString = serializeToUrl(newFilters, newPaging);
            history.replace({
                pathname: location.pathname,
                search: queryString,
            });
        },
        [history, location.pathname]
    );

    const updateFilters = React.useCallback(
        (newFilters: Partial<ReportFiltersState>) => {
            setFilters(prev => {
                const updated = { ...prev, ...newFilters };
                updateUrl(updated, paging);
                return updated;
            });
        },
        [updateUrl, paging]
    );

    const updatePaging = React.useCallback(
        (newPaging: Partial<PagingState>) => {
            setPaging(prev => {
                const updated = { ...prev, ...newPaging };
                updateUrl(filters, updated);
                return updated;
            });
        },
        [updateUrl, filters]
    );

    const resetFilters = React.useCallback(() => {
        setFilters(defaultFilters);
        setPaging(defaultPaging);
        history.replace({
            pathname: location.pathname,
            search: "",
        });
    }, [history, location.pathname]);

    return {
        filters,
        paging,
        updateFilters,
        updatePaging,
        resetFilters,
    };
}
