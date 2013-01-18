Meteor.Router.add({
    "/": "root",
    "/characters": "characters",
    "/characters/:id": function(id) {
        Session.set("characterId", id);
        return "character";
    }
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

Template.navbar.isPageActive = function (pagename) {
    var page = Meteor.Router.page();
    if (page == pagename)
        return "active";
    return "";
};
