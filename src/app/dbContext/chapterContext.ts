import { DB_Chapter, Chapter } from "../models/chapter";
import { Locales } from "./localeContext";

export interface ChapterContext {
    findAll: () => Chapter[];
    findByIds(ids: number[]): Chapter[];
    findById(id: number): Chapter;
    create(chapter: Chapter): Chapter;
    update(chapter: Chapter): Chapter;
    delete(id: number): void;
}

export const Chapters: ChapterContext = {
    findAll: function () {
        const chapters: DB_Chapter[] = window.database.getAll(
            window.database.tables.chapters
        );
        return ChapterMapperFromDBs(chapters);
    },
    findByIds: function (ids) {
        const chapters: DB_Chapter[] = window.database.getAll(
            window.database.tables.chapters
        );
        const filteredChapters = chapters.filter((chapter) => ids.includes(chapter.id));
        return ChapterMapperFromDBs(filteredChapters);
    },
    findById: function (id) {
        const chapter: DB_Chapter = window.database.get(
            id,
            window.database.tables.chapters
        );
        return ChapterMapperFromDB(chapter);
    },
    create: function (chapter) {
        if (chapter.header._id === null) {
            throw new Error("Chapter label is required");
        }

        const createdChapter: DB_Chapter = window.database.add(
            ChapterMapper(chapter),
            window.database.tables.chapters
        );
        return ChapterMapperFromDB(createdChapter);
    },
    update: function (chapter) {
        const updatedChapter: DB_Chapter = window.database.update(
            ChapterMapper(chapter),
            window.database.tables.chapters
        );
        return ChapterMapperFromDB(updatedChapter);
    },
    delete: function (id) {
        window.database.delete(id, window.database.tables.chapters);
    },
};

export const ChapterMapper = (chapter: Chapter): DB_Chapter => {
    if (!chapter) return null;
    return {
        id: chapter._id,
        headerId: chapter.header._id,
        pageIds: chapter.pages.map((locale) => locale._id),
    };
};

export const ChapterMapperFromDB = (chapter: DB_Chapter): Chapter => {
    if (!chapter) return null;
    return {
        _id: chapter.id,
        header: Locales.findById(chapter.headerId),
        pages: Locales.findByIds(chapter.pageIds),

    };
};

export const ChapterMapperFromDBs = (chapters: DB_Chapter[]): Chapter[] => {
    return chapters.map((chapter) => ChapterMapperFromDB(chapter));
};
