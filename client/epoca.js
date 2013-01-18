Template.hello.greeting = function () {
return "Welcome to epoca.";
};

Template.hello.currentUser = function() {
    var user = Meteor.user();
    if (!user) return "Anonymous";
    return displayName(Meteor.user());
}

Template.hello.events({
'click input' : function () {
  // template data, if any, is available in 'this'
  if (typeof console !== 'undefined')
    console.log("You pressed the button");
}
});
