import { useAppContext } from "$/webapp/contexts/app-context";
import { Permission, hasPermission } from "$/domain/entities/Permission";

export function usePermissions(): Record<Permission, boolean> {
    const { currentUser } = useAppContext();

    const permissions = Object.values(Permission).reduce((acc, permission) => {
        acc[permission] = hasPermission(currentUser, permission);
        return acc;
    }, {} as Record<Permission, boolean>);

    return permissions;
}
