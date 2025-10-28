import { NamedRef, Id } from "$/domain/entities/Ref";

export type OrgUnitPath = Id[];

export type OrganisationUnit = NamedRef & {
    path: OrgUnitPath;
};

export function getIdFromPath(path: OrgUnitPath): Id {
    return path.at(-1) as Id;
}

export function getOrgUnitParentPath(path: OrgUnitPath): OrgUnitPath {
    return path.slice(0, -1);
}
