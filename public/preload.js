const { contextBridge } = require("electron");
const db = require("electron-db");
const path = require("path");

const database = {};
database.tableNames = {
    events: "events",
    characters: "characters",
    factions: "factions",
    dbnames: "dbnames",
    timelines: "timelines",
};
database.location = path.join(__dirname, "database");

database.initDB = function() {
    let tables = [
        { name: database.tableNames.events },
        { name: database.tableNames.characters },
        { name: database.tableNames.factions },
        { name: database.tableNames.dbnames },
        { name: database.tableNames.timelines },
    ];

    tables.forEach((element) => {
        db.createTable(element.name, database.location, (succ, msg) => {
            if (succ) {
                console.log("Created table " + element.name);
            } else {
                console.log(
                    "Failed to create table " + element.name + " : " + msg
                );
            }
        });
    });
};
database.getAll = function(dbName, success, error) {
    if (db.valid(dbName)) {
        db.getAll(dbName, database.location, (succ, data) => {
            if (succ) {
                success(data);
            } else {
                error();
            }
        });
    }
};
database.get = function(dbName, id, success, error) {
    if (db.valid(dbName)) {
        let where = {
            id: id,
        };
        db.getRows(dbName, database.location, where, (succ, result) => {
            if (succ) {
                success(result);
            } else {
                error();
            }
        });
    }
};
database.add = function(dbName, obj, success, error) {
    if (db.valid(dbName)) {
        db.insertTableContent(dbName, database.location, obj, (succ, msg) => {
            if (succ) {
                success(result);
            } else {
                error(msg);
            }
        });
    }
};
database.edit = function(dbName, id, set, success, error) {
    if (db.valid(dbName)) {
        let where = {
            id: id,
        };

        db.updateRow(dbName, database.location, where, set, (succ, msg) => {
            if (succ) {
                success(set);
            } else {
                error(msg);
            }
        });
    }
};
database.remove = function(dbName, id, success, error) {
    if (db.valid(dbName)) {
        db.deleteRow(
            dbName,
            database.location, { id: id },
            (succ, msg) => {
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