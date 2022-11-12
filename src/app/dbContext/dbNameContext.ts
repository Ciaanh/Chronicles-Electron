import { DbName, DB_DbName } from "../models/dbname";

export interface DBNameContext {
    findAll: () => DbName[];
    findByIds(ids: number[]): DbName[];
    findById(id: number): DbName;
    create(dbname: DbName): DbName;
    update(dbname: DbName): DbName;
    delete(id: number): void;
}

export const DBNames: DBNameContext = {
    findAll: function () {
        const dbNames: DB_DbName[] = window.database.getAll(
            window.database.tables.dbnames
        );
        return DbNameMapperFromDBs(dbNames);
    },
    findByIds: function (ids) {
        const dbNames: DB_DbName[] = window.database.getAll(
            window.database.tables.dbnames
        );
        const filteredDBNames = dbNames.filter((dbName) =>
            ids.includes(dbName.id)
        );
        return DbNameMapperFromDBs(filteredDBNames);
    },
    findById: function (id) {
        const dbName: DB_DbName = window.database.get(
            id,
            window.database.tables.dbnames
        );
        return DbNameMapperFromDB(dbName);
    },
    create: function (dbName) {
        dbName._id = null;

        const createdDbName: DB_DbName = window.database.add(
            DbNameMapper(dbName),
            window.database.tables.dbnames
        );
        return DbNameMapperFromDB(createdDbName);
    },
    update: function (dbName) {
        const updatedDbName: DB_DbName = window.database.update(
            DbNameMapper(dbName),
            window.database.tables.dbnames
        );
        return DbNameMapperFromDB(updatedDbName);
    },
    delete: function (id) {
        window.database.delete(id, window.database.tables.dbnames);
    },
};

export const DbNameMapper = (dbname: DbName): DB_DbName => {
    if (!dbname) return null;
    return {
        id: dbname._id,
        name: dbname.name,
    };
};

export const DbNameMapperFromDB = (dbname: DB_DbName): DbName => {
    if (!dbname) return null;
    return {
        _id: dbname.id,
        name: dbname.name,
    };
};

export const DbNameMapperFromDBs = (dbnames: DB_DbName[]): DbName[] => {
    return dbnames.map((dbname) => DbNameMapperFromDB(dbname));
};
