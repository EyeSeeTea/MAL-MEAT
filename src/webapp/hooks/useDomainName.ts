import React from "react";
import { Domain, DomainType } from "$/domain/entities/Domain";
import { useDomainsContext } from "$/webapp/contexts/domains-context";

export function useDomainName(domainType: DomainType): string {
    const { domains } = useDomainsContext();
    return React.useMemo(() => getDomainName(domainType, domains), [domainType, domains]);
}

function getDomainName(domainType: DomainType, domains: Domain[]): string {
    const domain = domains.find(d => d.type === domainType);
    return domain ? domain.name : domainType;
}
