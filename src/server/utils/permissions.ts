/**
 * Permissions to application features which can be assigned to
 * user groups
 */
export enum Permissions {

    // Administration
    Users = "Benutzer", 
    Usergroups = "Benutzergruppen",

    // Portalzeugs
    Clients = "Mandantenverwaltung",

    // Dokumente
    Documents = "Dokumente",

    // FM Objekte
    FM_Objects = "FM Objekte"

}

/**
 * "nameof" helper function to retrieve the enum name for a specific enum.
 * Useful to rely on typescript types for enum references.
 */
export function getPermissionName(permission: Permissions) {
    return Object.keys(Permissions)[Object.keys(Permissions).map(k => Permissions[k as any]).indexOf(permission)];
}