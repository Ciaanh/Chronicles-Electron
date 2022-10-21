import { DbName, DB_DbName } from "../models/dbname";

export interface DBNameContext {
    findAll: () => DbName[];
    find(ids: number[]): DbName[];
    get(id: number): DbName;
    create(dbname: DbName): DbName;
    update(dbname: DbName): DbName;
    delete(id: number): number;
}

export const DBNames: DBNameContext = {
    findAll: function () {
        const dbNames: DB_DbName[] = window.database.getAll(
            window.database.tableNames.dbnames
        );
        return DbNameMapperFromDBs(dbNames);
    },
    find: function (ids) {
        const dbNames: DB_DbName[] = window.database.getAll(
            window.database.tableNames.dbnames
        );
        const filteredDBNames = dbNames.filter((dbName) =>
            ids.includes(dbName.id)
        );
        return DbNameMapperFromDBs(filteredDBNames);
    },
    get: function (id) {
        const dbName: DB_DbName = window.database.get(
            window.database.tableNames.dbnames,
            id
        );
        return DbNameMapperFromDB(dbName);
    },
    create: function (dbName) {
        const dbNames = window.database
            .getAll(window.database.tableNames.dbnames)
            .map((dbName) => dbName.id);

        const newId = dbNames.length > 0 ? Math.max(...dbNames) + 1 : 1;
        dbName._id = newId;

        const createdDbName: DB_DbName = window.database.add(
            window.database.tableNames.dbnames,
            DbNameMapper(dbName)
        );
        return DbNameMapperFromDB(createdDbName);
    },
    update: function (dbName) {
        const updatedDbName: DB_DbName = window.database.update(
            window.database.tableNames.dbnames,

            DbNameMapper(dbName)
        );
        return DbNameMapperFromDB(updatedDbName);
    },
    delete: function (id) {
        return window.database.delete(window.database.tableNames.dbnames, id);
    },
};

export const DbNameMapper = (dbname: DbName): DB_DbName => {
    return {
        id: dbname._id,
        name: dbname.name,
    };
};

export const DbNameMapperFromDB = (dbname: DB_DbName): DbName => {
    return {
        _id: dbname.id,
        name: dbname.name,
    };
};

export const DbNameMapperFromDBs = (dbnames: DB_DbName[]): DbName[] => {
    return dbnames.map((dbname) => DbNameMapperFromDB(dbname));
};
