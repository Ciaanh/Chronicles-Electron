const { contextBridge } = require("electron");
const db = require("electron-db");

const database = {};
database.tableNames = {
    events: "events",
    characters: "characters",
    factions: "factions",
    dbnames: "dbnames",
    timelines: "timelines",
};
database.initDB = function() {
    let tables = [
        { name: database.tableNames.events },
        { name: database.tableNames.characters },
        { name: database.tableNames.factions },
        { name: database.tableNames.dbnames },
        { name: database.tableNames.timelines },
    ];
    tables.forEach((element) => {
        db.createTable(element.name, (succ, msg) => {
            if (succ) {
                console.log("Created table " + element.name);
            } else {
                console.log("Failed to create table " + element.name);
            }
        });
    });
};
database.getAll = function(dbName) {
    if (db.valid(dbName)) {
        db.getAll(dbName, (succ, data) => {
            // succ - boolean, tells if the call is successful
            // data - array of objects that represents the rows.
        });
    }
};
database.get = function(dbName, id) {
    if (db.valid(dbName)) {
        let where = {
            uniqueId: id,
        };
        db.getRows(dbName, where, (succ, result) => {
            // succ - boolean, tells if the call is successful
            console.log("Success: " + succ);
            console.log(result);
        });
    }
};
database.add = function(dbName, obj) {
    if (db.valid(dbName)) {
        db.insertTableContent(dbName, obj, (succ, msg) => {
            // succ - boolean, tells if the call is successful
            console.log("Success: " + succ);
            console.log("Message: " + msg);
        });
    }
};
database.edit = function(dbName, id, set) {
    if (db.valid(dbName)) {
        let where = {
            uniqueId: id,
        };

        db.updateRow("customers", where, set, (succ, msg) => {
            // succ - boolean, tells if the call is successful
            console.log("Success: " + succ);
            console.log("Message: " + msg);
        });
    }
};
database.remove = function(dbName, id) {
    if (db.valid(dbName)) {
        db.deleteRow(dbName, { uniqueId: id }, (succ, msg) => {
            console.log(msg);
        });
    }
};

contextBridge.exposeInMainWorld("database", {
    test: "test toto yoyo",
    tableNames: database.tableNames,
    initDB: database.initDB,
    getAll: database.getAll,
    get: database.get,
    add: database.add,
    edit: database.edit,
    remove: database.remove,
});