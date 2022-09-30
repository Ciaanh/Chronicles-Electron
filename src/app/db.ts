const service = {};


// window.database.getAll(
//     window.database.tableNames.factions,
//     (factions) => dispatch(editCharacter_factions_loaded(factions)),
//     (error) => dispatch(editCharacter_error(error))
// );


// window.database.edit(
//     window.database.tableNames.characters,
//     character.id,
//     character,
//     (saved_character) => {
//         dispatch(editCharacter_close());
//         dispatch(characters_saved(saved_character));
//     },
//     (error) => dispatch(editCharacter_error(error))
// );


// window.database.add(
//     window.database.tableNames.characters, {
//         name: character.name,
//         biography: character.biography,
//         timeline: character.timeline,
//         factions: character.factions,
//         dbname: character.dbname,
//     },
//     (created_character) => {
//         dispatch(editCharacter_close());
//         dispatch(characters_created(created_character));
//     },
//     (error) => dispatch(editCharacter_error(error))
// );

// window.database.remove(
//     window.database.tableNames.characters,
//     id,
//     (deletedid) => dispatch(characters_deleted(deletedid)),
//     (error) => dispatch(editCharacter_error(error))
// );

service.getDBNames = function(dbids) {

    const docquery = DBName.find({ _id: { $in: dbids } }).read(
        ReadPreference.NEAREST
    );
    return docquery.exec();
};

service.getEvents = function(dbids) {
    const docquery = Event.find({ dbname: { $in: dbids } }).read(
        ReadPreference.NEAREST
    );
    return docquery.exec();
};

service.getFactions = function(dbids) {
    const docquery = Faction.find({ dbname: { $in: dbids } }).read(
        ReadPreference.NEAREST
    );
    return docquery.exec();
};

service.getCharacters = function(dbids) {
    const docquery = Character.find({ dbname: { $in: dbids } }).read(
        ReadPreference.NEAREST
    );
    return docquery.exec();
};


export default service;