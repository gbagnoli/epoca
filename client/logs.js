Template.logs.logs = function () {
    return Logs.find();
};

Template.log.ownerName = function () {
    return displayName(this.user);
};

Template.log.displayContent = function () {
    return JSON.stringify(this.content, undefined, 2);
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
    }
});
