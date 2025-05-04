import { Collection, DB_Collection } from "../models/collection";

export interface CollectionContext {
    findAll: () => Collection[];
    findByIds(ids: number[]): Collection[];
    findById(id: number): Collection;
    create(collection: Collection): Collection;
    update(collection: Collection): Collection;
    delete(id: number): void;
}

export const Collections: CollectionContext = {
    findAll: function () {
        const collections: DB_Collection[] = window.database.getAll(
            window.database.tables.collections
        );
        return CollectionMapperFromDBs(collections);
    },
    findByIds: function (ids) {
        const collections: DB_Collection[] = window.database.getAll(
            window.database.tables.collections
        );
        const filteredCollections = collections.filter((collection) =>
            ids.includes(collection.id)
        );
        return CollectionMapperFromDBs(filteredCollections);
    },
    findById: function (id) {
        const collection: DB_Collection = window.database.get(
            id,
            window.database.tables.collections
        );
        return CollectionMapperFromDB(collection);
    },
    create: function (collection) {
        const createdCollection: DB_Collection = window.database.add(
            CollectionMapper(collection),
            window.database.tables.collections
        );
        return CollectionMapperFromDB(createdCollection);
    },
    update: function (collection) {
        const updatedCollection: DB_Collection = window.database.update(
            CollectionMapper(collection),
            window.database.tables.collections
        );
        return CollectionMapperFromDB(updatedCollection);
    },
    delete: function (id) {
        window.database.delete(id, window.database.tables.collections);
    },
};

export const CollectionMapper = (collection: Collection): DB_Collection => {
    if (!collection) return null;
    return {
        id: collection._id,
        name: collection.name,
    };
};

export const CollectionMapperFromDB = (collection: DB_Collection): Collection => {
    if (!collection) return null;
    return {
        _id: collection.id,
        name: collection.name,
    };
};

export const CollectionMapperFromDBs = (collections: DB_Collection[]): Collection[] => {
    return collections.map((collection) => CollectionMapperFromDB(collection));
};
