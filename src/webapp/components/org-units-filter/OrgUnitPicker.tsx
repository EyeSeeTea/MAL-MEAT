import React from "react";
import { OrgUnitsSelector } from "@eyeseetea/d2-ui-components";
import { D2Api } from "$/types/d2-api";
import { getOrgUnitParentPath, OrgUnitPath } from "$/domain/entities/OrganisationUnit";
import _c from "$/domain/entities/generic/Collection";

export interface OrgUnitPickerProps {
    api: D2Api;
    selected: OrgUnitPath[];
    setSelected(newPaths: OrgUnitPath[]): void;
}

export const OrgUnitPicker: React.FC<OrgUnitPickerProps> = React.memo(props => {
    const { api, selected, setSelected } = props;
    const OU_SELECTOR_PATH_SEPARATOR = "/";
    const initiallyExpanded = React.useMemo(
        () =>
            _c(selected)
                .compact()
                .map(getOrgUnitParentPath)
                .map((ouPath: OrgUnitPath) => ouPath.join(OU_SELECTOR_PATH_SEPARATOR))
                .value(),
        [selected]
    );

    return (
        <OrgUnitsSelector
            api={api}
            selected={selected.map(ouPath => ouPath.join(OU_SELECTOR_PATH_SEPARATOR))}
            onChange={(value: string[]) =>
                setSelected(value.map(x => x.split(OU_SELECTOR_PATH_SEPARATOR) as OrgUnitPath))
            }
            fullWidth={false}
            withElevation={false}
            initiallyExpanded={initiallyExpanded.length ? initiallyExpanded : undefined}
            singleSelection
            levels={[3]}
            controls={{
                filterByLevel: false,
                filterByGroup: false,
                filterByProgram: false,
                selectAll: false,
            }}
        />
    );
});
