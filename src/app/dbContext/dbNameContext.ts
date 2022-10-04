import { DbName, DB_DbName } from "../models/dbname";

export interface DBNameContext {
    getAll: () => Promise<DbName[]>;
    getDBNames(dbids: number[]): Promise<DbName[]>;
    getDBName(dbid: number): Promise<DbName>;
    addDBName(dbname: DbName): Promise<DbName>;
    updateDBName(dbname: DbName): Promise<DbName>;
    deleteDBName(dbid: number): Promise<number>;
}

export const DBNames: DBNameContext = {
    getAll: function () {
        return new Promise(function (resolve, reject) {
            window.database.getAll(
                window.database.tableNames.dbnames,
                (dbNames: DB_DbName[]) => resolve(DbNameMapperFromDBs(dbNames)),
                (error) => reject(error)
            );
        });
    },
    getDBNames: function (dbids) {
        return new Promise(function (resolve, reject) {
            window.database.getAll(
                window.database.tableNames.dbnames,
                (dbNames: DB_DbName[]) => {
                    const filteredDBNames = dbNames.filter((dbName) =>
                        dbids.includes(dbName.id)
                    );
                    resolve(DbNameMapperFromDBs(filteredDBNames));
                },
                (error) => reject(error)
            );
        });
    },
    getDBName: function (dbNameId) {
        return new Promise(function (resolve, reject) {
            window.database.get(
                window.database.tableNames.dbnames,
                dbNameId,
                (dbName: DB_DbName) => resolve(DbNameMapperFromDB(dbName)),
                (error) => reject(error)
            );
        });
    },
    addDBName: function (dbName) {
        return new Promise(function (resolve, reject) {
            window.database.add(
                window.database.tableNames.dbnames,
                DbNameMapper(dbName),
                (dbName: DB_DbName) => resolve(DbNameMapperFromDB(dbName)),
                (error) => reject(error)
            );
        });
    },
    updateDBName: function (dbName) {
        return new Promise(function (resolve, reject) {
            window.database.update(
                window.database.tableNames.dbnames,
                dbName._id,
                DbNameMapper(dbName),
                (dbName: DB_DbName) => resolve(DbNameMapperFromDB(dbName)),
                (error) => reject(error)
            );
        });
    },
    deleteDBName: function (dbNameId) {
        return new Promise(function (resolve, reject) {
            window.database.delete(
                window.database.tableNames.dbnames,
                dbNameId,
                () => resolve(dbNameId),
                (error) => reject(error)
            );
        });
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
