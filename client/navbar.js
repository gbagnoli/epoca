Template.navbar.isPageActive = function (pagename) {
    var page = Meteor.Router.page();
    if (page == pagename)
        return true;
    return false;
};

Template.navbar.activeClass = function (pagename) {
    var page = Meteor.Router.page();
    if (page == pagename)
        return "active";
    return "";
};

Template.navbar.charName = function () {
    return Session.get('character').nome;
};

Template.navbar.submittable = Template.character.submittable;
Template.navbar.changed = Template.character.changed;

Template.navbar.rendered = function() {
    var tab = Session.get('activeTab');
    if (!tab) {
        console.log("null tab?");
        return;
    }
    $("a.tablink").click(function (e) {
        e.preventDefault();
        $(this).tab("show");
        $(".dropdown-toggle").dropdown('toggle');
    });
    $('a.tablink').on('shown', function(e) {
        Session.set('activeTab', this.id);
    });
    $('#' + tab).tab("show");
};

Template.navbar.events({
    'click #save': function(event) {
        if (Session.get('dirty') && !Session.get("errors")) {
            var logData = _.clone(Session.get("dirty"));
            logData['character'] = Session.get('character').nome;
            Logs.insert({user: Meteor.user(), action: "Update Character",
                        content: logData, date: new Date()});
            Characters.update(Session.get('character')._id, {$set: Session.get("dirty")});
        }
        Session.set('dirty', null);
    },
    'click #reset': function(event) {
        console.log('Aborting changes');
        var clear = function(id) {
            var jfield = $('#' + id);
            // This sets the _original_ value!
            jfield.val(jfield[0].attributes['value'].value);
        };

        var clearObject = function(obj) {
            if (!obj)
                return;
            _.map(obj, function(elem, key) {
                if (_.isObject(elem)) {
                    _.map(elem, function(e, k) {
                        clear(key + "-" + k);
                    });
                } else {
                    clear(key);
                }
            });
        };
        var errors = Session.get('errors');
        var dirty = Session.get('dirty');
        clearObject(errors);
        clearObject(dirty);
        Session.set('dirty', null);
        Session.set('errors', null);
    }
});

