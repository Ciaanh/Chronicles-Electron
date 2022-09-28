const { contextBridge } = require("electron");
const db = require("electron-db");
const path = require("path");

const database: any = {};
database.tableNames = {
    events: "events",
    characters: "characters",
    factions: "factions",
    dbnames: "dbnames",
    timelines: "timelines",
};
database.location = path.join(__dirname, "database");

database.initDB = function () {
    let tables = [
        { name: database.tableNames.events },
        { name: database.tableNames.characters },
        { name: database.tableNames.factions },
        { name: database.tableNames.dbnames },
        { name: database.tableNames.timelines },
    ];

    tables.forEach((element) => {
        db.createTable(
            element.name,
            database.location,
            (succ: any, msg: any) => {
                if (succ) {
                    console.log("Created table " + element.name);
                } else {
                    console.log(
                        "Failed to create table " + element.name + " : " + msg
                    );
                }
            }
        );
    });
};
database.getAll = function (dbName: string, success: any, error: any) {
    if (db.valid(dbName)) {
        db.getAll(dbName, database.location, (succ: any, data: any) => {
            if (succ) {
                success(data);
            } else {
                error();
            }
        });
    }
};
database.get = function (dbName: string, id: number, success: any, error: any) {
    if (db.valid(dbName)) {
        let where = {
            id: id,
        };
        db.getRows(
            dbName,
            database.location,
            where,
            (succ: any, result: any) => {
                if (succ) {
                    success(result);
                } else {
                    error();
                }
            }
        );
    }
};
database.add = function (dbName: string, obj: any, success: any, error: any) {
    if (db.valid(dbName)) {
        db.insertTableContent(
            dbName,
            database.location,
            obj,
            (succ: any, msg: any) => {
                if (succ) {
                    this.get(dbName, obj.id, success, error);
                } else {
                    error(msg);
                }
            }
        );
    }
};
database.edit = function (
    dbName: string,
    id: number,
    set: any,
    success: any,
    error: any
) {
    if (db.valid(dbName)) {
        let where = {
            id: id,
        };

        db.updateRow(
            dbName,
            database.location,
            where,
            set,
            (succ: any, msg: any) => {
                if (succ) {
                    this.get(dbName, id, success, error);
                } else {
                    error(msg);
                }
            }
        );
    }
};
database.remove = function (
    dbName: string,
    id: number,
    success: any,
    error: any
) {
    if (db.valid(dbName)) {
        db.deleteRow(
            dbName,
            database.location,
            { id: id },
            (succ: any, msg: any) => {
                if (succ) {
                    success(id);
                } else {
                    error(msg);
                }
            }
        );
    }

    return id;
};

contextBridge.exposeInMainWorld("database", {
    tableNames: database.tableNames,
    initDB: database.initDB,
    getAll: database.getAll,
    get: database.get,
    add: database.add,
    edit: database.edit,
    remove: database.remove,
});
