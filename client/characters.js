Template.characters.anyCharacters = function() {
    return Characters.find().count() > 0;
};

Template.characters.characters = function() {
    return Characters.find();
};

Template.characters.ownerName = function(owner) { return displayName(owner); };
Template.character.character = function() { return Session.get('character'); };
Template.character404.character = function() { return Session.get('characterId'); };
