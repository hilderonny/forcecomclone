/**
 * Modules for which user groups can have read or write
 * access rights
 */
export enum Module {

    // Administration
    Users = "Benutzer", 
    Usergroups = "Benutzergruppen",

    // Portalzeugs
    Clients = "Mandantenverwaltung",

    // Dokumente
    Documents = "Dokumente",

    // FM Objekte
    FM_Objects = "FM Objekte",

    Datatypes = "Datentypen"
    
}

/**
 * "nameof" helper function to retrieve the enum name for a specific enum.
 * Useful to rely on typescript types for enum references.
 */
export function getModuleName(module: Module) {
    return Object.keys(Module)[Object.keys(Module).map(k => Module[k as any]).indexOf(module)];
}