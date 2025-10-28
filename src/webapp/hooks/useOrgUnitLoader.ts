import React from "react";
import { getIdFromPath, OrgUnitPath } from "$/domain/entities/OrganisationUnit";
import { useLoader } from "./useLoader";
import { Future } from "$/domain/entities/generic/Future";

export function useOrgUnitLoader({ paths }: { paths: OrgUnitPath[] }) {
    return useLoader(
        React.useCallback(
            compositionRoot => {
                if (!paths.length) {
                    return Future.success([]);
                }
                const ids = paths.map(getIdFromPath);
                return compositionRoot.organisationUnits.getByIds.execute(ids);
            },
            [paths]
        )
    );
}
