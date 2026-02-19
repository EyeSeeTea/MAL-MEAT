import React from "react";
import styled from "styled-components";
import { Select, MenuItem, InputLabel, FormControl, Button } from "@material-ui/core";
import { Clear } from "@material-ui/icons";
import i18n from "$/utils/i18n";
import { Domain, DomainType } from "$/domain/entities/Domain";
import { OrgUnitFilter } from "$/webapp/components/org-units-filter/OrgUnitFilter";
import { OrgUnitPath } from "$/domain/entities/OrganisationUnit";
import { useReportFiltersOptions } from "$/webapp/hooks/useReportFiltersOptions";

export interface ReportFiltersProps {
    domains: Domain[];
    selectedDomainType: DomainType | undefined;
    selectedOrgUnit: OrgUnitPath | undefined;
    selectedYear: number | undefined;
    selectedLevelOfAudit: string | undefined;
    onDomainChange: (domainType: DomainType | undefined) => void;
    onOrgUnitChange: (orgUnitPath: OrgUnitPath | undefined) => void;
    onYearChange: (year: number | undefined) => void;
    onLevelOfAuditChange: (levelOfAudit: string | undefined) => void;
    onReset: () => void;
}

export const ReportFilters: React.FC<ReportFiltersProps> = ({
    domains,
    selectedDomainType,
    selectedOrgUnit,
    selectedYear,
    selectedLevelOfAudit,
    onDomainChange,
    onOrgUnitChange,
    onYearChange,
    onLevelOfAuditChange,
    onReset,
}) => {
    const { auditLevelOptions, yearOptions } = useReportFiltersOptions(domains);

    const handleDomainChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        const value = event.target.value as DomainType;
        onDomainChange(value || undefined);
    };

    const handleYearChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        const value = event.target.value as string;
        onYearChange(value ? Number(value) : undefined);
    };

    const handleLevelOfAuditChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        const value = event.target.value as string;
        onLevelOfAuditChange(value || undefined);
    };

    const handleOrgUnitChange = (orgUnitIds: OrgUnitPath[]) => {
        onOrgUnitChange(orgUnitIds[0]);
    };

    const selectedOrgUnits = React.useMemo(
        () => (selectedOrgUnit ? [selectedOrgUnit] : []),
        [selectedOrgUnit]
    );

    const isResetVisible = Boolean(
        selectedDomainType || selectedOrgUnit || selectedYear || selectedLevelOfAudit
    );

    return (
        <FiltersContainer>
            <FilterRow>
                <FilterControl>
                    <InputLabel>{i18n.t("Domain")}</InputLabel>
                    <Select value={selectedDomainType ?? ""} onChange={handleDomainChange}>
                        <MenuItem value="">{i18n.t("All domains")}</MenuItem>
                        {domains.map(domain => (
                            <MenuItem key={domain.type} value={domain.type}>
                                {domain.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FilterControl>

                <FilterControl>
                    <OrgUnitFilter selected={selectedOrgUnits} onChange={handleOrgUnitChange} />
                </FilterControl>

                <FilterControl>
                    <InputLabel>{i18n.t("Level of Audit")}</InputLabel>
                    <Select value={selectedLevelOfAudit ?? ""} onChange={handleLevelOfAuditChange}>
                        <MenuItem value="">{i18n.t("All levels")}</MenuItem>
                        {auditLevelOptions.map(option => (
                            <MenuItem key={option.code} value={option.code}>
                                {option.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FilterControl>

                <FilterControl>
                    <InputLabel>{i18n.t("Year")}</InputLabel>
                    <Select value={selectedYear ?? ""} onChange={handleYearChange}>
                        <MenuItem value="">{i18n.t("All years")}</MenuItem>
                        {yearOptions.map(year => (
                            <MenuItem key={year} value={year}>
                                {year}
                            </MenuItem>
                        ))}
                    </Select>
                </FilterControl>

                {isResetVisible && (
                    <ResetButton variant="outlined" onClick={onReset} startIcon={<Clear />}>
                        {i18n.t("Reset Filters")}
                    </ResetButton>
                )}
            </FilterRow>
        </FiltersContainer>
    );
};

const FiltersContainer = styled.div`
    padding: 1rem;
`;

const FilterRow = styled.div`
    display: flex;
    gap: 1rem;
    align-items: flex-end;
    flex-wrap: wrap;
`;

const FilterControl = styled(FormControl)`
    min-width: 200px;
`;

const ResetButton = styled(Button)`
    height: fit-content;
`;
