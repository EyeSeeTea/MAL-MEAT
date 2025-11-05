import { User } from "$/domain/entities/User";

export enum Permission {
    APP_ACCESS = "APP_ACCESS",
    EDIT = "EDIT",
    SUMMARY_PAGE = "SUMMARY_PAGE",
    DETAILS_PAGE = "DETAILS_PAGE",
    REPORT_LIST_PAGE = "REPORT_LIST_PAGE",
}

export function hasPermission(user: User, permission: Permission): boolean {
    switch (permission) {
        case Permission.APP_ACCESS:
            return user.isViewer() || user.isAdmin();
        case Permission.EDIT:
            return user.isAdmin();
        case Permission.REPORT_LIST_PAGE:
            return user.isViewer() || user.isAdmin();
        case Permission.SUMMARY_PAGE:
            return user.isAdmin();
        case Permission.DETAILS_PAGE:
            return user.isViewer() || user.isAdmin();
        default:
            return false;
    }
}
