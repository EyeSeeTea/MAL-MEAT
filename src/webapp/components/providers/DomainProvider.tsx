import { Domain } from "$/domain/entities/Domain";
import { useAppContext } from "$/webapp/contexts/app-context";
import { DomainsContext } from "$/webapp/contexts/domains-context";
import React from "react";

type DomainsProviderProps = {
    children: React.ReactNode;
};

export const DomainsProvider: React.FC<DomainsProviderProps> = ({ children }) => {
    const { compositionRoot } = useAppContext();
    const [domains, setDomains] = React.useState<Domain[]>([]);
    const [error, setError] = React.useState<string | null>(null);
    const [loading, setLoading] = React.useState<boolean>(true);
    React.useEffect(() => {
        setLoading(true);
        return compositionRoot.domains.getAll.execute().run(
            domains => {
                setDomains(domains);
                setLoading(false);
            },
            error => {
                setError(error.message);
                setLoading(false);
            }
        );
    }, [compositionRoot]);
    return (
        <DomainsContext.Provider
            value={{
                domains,
                loading,
                error,
            }}
        >
            {children}
        </DomainsContext.Provider>
    );
};
