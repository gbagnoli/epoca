
Template.root.currentUser = function() {
    var user = Meteor.user();
    if (!user) return "Anonymous";
    return displayName(Meteor.user());
}

Template.root.isLoggedIn = function() {
    var user = Meteor.user();
    if (!user)
        return false;
    return true;
};

