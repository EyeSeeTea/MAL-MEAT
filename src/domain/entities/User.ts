import { Struct } from "./generic/Struct";
import { Id, NamedRef } from "./Ref";

export type UserAttrs = {
    id: Id;
    name: string;
    username: string;
    userRoles: UserRole[];
    userGroups: NamedRef[];
};

export type UserRole = {
    id: Id;
    name: string;
    authorities: string[];
};

const ADMIN_USER_GROUP_UID = "suMb19wGXPR";
const VIEWER_USER_GROUP_UID = "OviFXqdot0H";

export class User extends Struct<UserAttrs>() {
    belongToUserGroup(userGroupUid: Id): boolean {
        return this.userGroups.some(({ id }) => id === userGroupUid);
    }

    isAdmin(): boolean {
        return this.belongToUserGroup(ADMIN_USER_GROUP_UID);
    }

    isViewer(): boolean {
        return this.belongToUserGroup(VIEWER_USER_GROUP_UID);
    }
}
