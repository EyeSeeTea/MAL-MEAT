import { Domain } from "$/domain/entities/Domain";
import React, { useContext } from "react";

export type DomainsContextState = {
    domains: Domain[];
    loading: boolean;
    error: string | null;
};

export const DomainsContext = React.createContext<DomainsContextState | null>(null);

export function useDomainsContext() {
    const context = useContext(DomainsContext);
    if (context) {
        return context;
    } else {
        throw new Error("Domains context uninitialized");
    }
}
