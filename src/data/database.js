// https://www.npmjs.com/package/electron-db
import db from "./electron-db";

const service = {};

service.tableNames = {
    events: "events",
    characters: "characters",
    factions: "factions",
    dbnames: "dbnames",
    timelines: "timelines",
};

const tables = [
    { name: service.tableNames.events },
    { name: service.tableNames.characters },
    { name: service.tableNames.factions },
    { name: service.tableNames.dbnames },
    { name: service.tableNames.timelines },
];

service.initDB = function() {
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

service.getAll = function(dbName) {
    if (db.valid(dbName)) {
        db.getAll(dbName, (succ, data) => {
            // succ - boolean, tells if the call is successful
            // data - array of objects that represents the rows.
        });
    }
};

service.get = function(dbName, id) {
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

service.add = function(dbName, obj) {
    if (db.valid(dbName)) {
        db.insertTableContent(dbName, obj, (succ, msg) => {
            // succ - boolean, tells if the call is successful
            console.log("Success: " + succ);
            console.log("Message: " + msg);
        });
    }
};

service.edit = function(dbName, id, set) {
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

service.remove = function(dbName, id) {
    if (db.valid(dbName)) {
        db.deleteRow(dbName, { uniqueId: id }, (succ, msg) => {
            console.log(msg);
        });
    }
};

export default service;