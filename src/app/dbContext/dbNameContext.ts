import { DbName, DB_DbName } from "../models/dbname";

export interface DBNameContext {
    findAll: () => Promise<DbName[]>;
    find(ids: number[]): Promise<DbName[]>;
    get(id: number): Promise<DbName>;
    create(dbname: DbName): Promise<DbName>;
    update(dbname: DbName): Promise<DbName>;
    delete(id: number): Promise<number>;
}

export const DBNames: DBNameContext = {
    findAll: function () {
        return new Promise(function (resolve, reject) {
            window.database.getAll(
                window.database.tableNames.dbnames,
                (dbNames: DB_DbName[]) => resolve(DbNameMapperFromDBs(dbNames)),
                (error) => reject(error)
            );
        });
    },
    find: function (ids) {
        return new Promise(function (resolve, reject) {
            window.database.getAll(
                window.database.tableNames.dbnames,
                (dbNames: DB_DbName[]) => {
                    const filteredDBNames = dbNames.filter((dbName) =>
                        ids.includes(dbName.id)
                    );
                    resolve(DbNameMapperFromDBs(filteredDBNames));
                },
                (error) => reject(error)
            );
        });
    },
    get: function (id) {
        return new Promise(function (resolve, reject) {
            window.database.get(
                window.database.tableNames.dbnames,
                id,
                (dbName: DB_DbName) => resolve(DbNameMapperFromDB(dbName)),
                (error) => reject(error)
            );
        });
    },
    create: function (dbName) {
        return new Promise(function (resolve, reject) {
            window.database.add(
                window.database.tableNames.dbnames,
                DbNameMapper(dbName),
                (dbName: DB_DbName) => resolve(DbNameMapperFromDB(dbName)),
                (error) => reject(error)
            );
        });
    },
    update: function (dbName) {
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
    delete: function (id) {
        return new Promise(function (resolve, reject) {
            window.database.delete(
                window.database.tableNames.dbnames,
                id,
                () => resolve(id),
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
