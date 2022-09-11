// https://www.npmjs.com/package/electron-db
const db = require("electron-db");

const dbs = [
    { name: "events" },
    { name: "characters" },
    { name: "factions" },
    { name: "dbnames" },
    { name: "timelines" },
];

export function initDB() {
    dbs.forEach((element) => {
        db.createTable(element.name, (succ, msg) => {
            if (succ) {
                console.log("Created table " + element.name);
            } else {
                console.log("Failed to create table " + element.name);
            }
        });
    });
}

export function getAll(dbName) {
    if (db.valid(dbName)) {
        db.getAll(dbName, (succ, data) => {
            // succ - boolean, tells if the call is successful
            // data - array of objects that represents the rows.
        });
    }
}
export function get(dbName, id) {
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
}
export function add(dbName, obj) {
    if (db.valid(dbName)) {
        db.insertTableContent(dbName, obj, (succ, msg) => {
            // succ - boolean, tells if the call is successful
            console.log("Success: " + succ);
            console.log("Message: " + msg);
        });
    }
}
export function edit(dbName, id, set) {
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
}
export function remove(dbName, id) {
    if (db.valid(dbName)) {
        db.deleteRow(dbName, { uniqueId: id }, (succ, msg) => {
            console.log(msg);
        });
    }
}