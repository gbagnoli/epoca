
Template.root.greeting = function () {
return "Welcome to epoca.";
};

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

Template.root.events({
    'click button' : function () {
      // template data, if any, is available in 'this'
      if (typeof console !== 'undefined')
        console.log("You pressed the button");
    }
});
