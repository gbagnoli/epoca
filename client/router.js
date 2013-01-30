Meteor.Router.add({
    "/": "root",
    "/characters": function() {
        Session.set("error", false);
        return "characters";
    },
    "/characters/:id": function(id) {
        Session.set("characterId", id);
        var char = Characters.findOne({"nome": id});
        if (!char) {
            return "character404";
        }
        Session.set("character", char);
        Session.set("dirty", null);
        Session.set('errors', null);
        var tab = Session.get("activeTab");
        if (!tab)
            Session.set('activeTab', "linkcaratteristiche");
        return "character";
    },
    "/logs": "logs"
});

Meteor.Router.filters({
    requireLogin: function(page) {
        var user = Meteor.user();
        if (user) {
            return page;
        } else {
            return "root";
        }
    }
});

Meteor.Router.filter("requireLogin", {except: "root"});
