Template.logs.logs = function () {
    return Logs.find();
};

Template.logs.anyLog= function () {
    return Logs.find().count() > 0;
};

Template.log.ownerName = function () {
    return displayName(this.user);
};

Template.log.displayContent = function () {
    return JSON.stringify(this.content, undefined, 2);
};

Template.log.prettyDate = function() {
    return jQuery.timeago(this.date);
};

Template.log.events({
    'click .remove-log': function (event) {
        var node;
        // Always get the button, not the icon
        if (!event.currentTarget)
            node = event.target;
        else
            node = event.currentTarget;
        node = $(node);
        var log_id = node.attr('log');
        Logs.remove({"_id": log_id});
    },
});

Template.logs.events({
    'click #remove-all-logs': function(event) {
        bootbox.confirm("Sicuro di voler rimuovere tutti i log?",
                        function (result) {
                            if (result) {
                                Logs.remove({});
                            }
                        });
    }
})
