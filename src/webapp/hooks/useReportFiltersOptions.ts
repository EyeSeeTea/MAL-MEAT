import { Domain } from "$/domain/entities/Domain";
import React from "react";

const MAX_YEARS = 10;

export function useReportFiltersOptions(domains: Domain[]) {
    const auditLevelOptions = React.useMemo(() => {
        const optionsMap = new Map<string, string>();
        domains.forEach(domain => {
            domain.audit.level.options.forEach(option => {
                optionsMap.set(option.code, option.name);
            });
        });
        return Array.from(optionsMap.entries()).map(([code, name]) => ({
            code,
            name,
        }));
    }, [domains]);

    const yearOptions = React.useMemo(() => {
        const currentYear = new Date().getFullYear();
        const years: number[] = [];
        for (let i = 0; i <= MAX_YEARS; i++) {
            years.push(currentYear - i);
        }
        return years;
    }, []);

    return { auditLevelOptions, yearOptions };
}
