import { Db } from "./db";

export async function createDatatype(databasename: string, datatypename: string, label: string, plurallabel: string, showinmenu: boolean) {
    await Db.query(databasename, "INSERT INTO datatypes (name, label, plurallabel, showinmenu) VALUES ('" + datatypename + "', '" + label + "', '" + plurallabel + "', " + showinmenu + ")");
    await Db.query(databasename, "INSERT INTO datatypefields (name, label, datatype, fieldtype, istitle) VALUES ('name', 'Name', '" + datatypename + "', 'TEXT', true)");
    await Db.query(databasename, "CREATE TABLE " + datatypename + " (name TEXT PRIMARY KEY)");
}

export async function deleteDatatype(databasename: string, datatypename: string) {
    await Db.query(databasename, "DROP TABLE " + datatypename);
    await Db.query(databasename, "DELETE FROM datatypefields WHERE datatype = '" + datatypename + "'");
    await Db.query(databasename, "DELETE FROM datatypes WHERE name = '" + datatypename + "'");
}

export async function createDatatypeField(databasename: string, datatypename: string, fieldname: string, label: string, fieldtype: string, istitle: boolean) {
    await Db.query(databasename, "INSERT INTO datatypefields (name, label, datatype, fieldtype, istitle) VALUES ('" + fieldname + "', '" + label + "', '" + datatypename + "', '" + fieldtype + "', " + istitle + ")");
    await Db.query(databasename, "ALTER TABLE " + datatypename + " ADD COLUMN " + fieldname + " " + fieldtype);
}

export async function deleteDatatypeField(databasename: string, datatypename: string, fieldname: string) {
    await Db.query(databasename, "ALTER TABLE " + datatypename + " DROP COLUMN " + fieldname);
    await Db.query(databasename, "DELETE FROM datatypefields WHERE name = '" + fieldname + "' AND datatype = '" + datatypename + "'");
}
