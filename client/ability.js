var valueOf = function(ab, what) {
    if (!ab.char[ab.key])
        return 0;
    var value = ab.char[ab.key][what];
    if (isNaN(value))
        return 0;
    return value;
};

var getValoreGradi = function(ab) {
    // TODO bonus_gradi
    var gradi5 =  valueOf(ab, 'gradi5');
    if (_.isNull(ab.gradi5))
        gradi5 = parentValue(ab, 'gradi5');
    return (gradi5 * 5) + (valueOf(ab, 'gradi3') * 3) + valueOf(ab, 'gradi1');
};

var parentValue = function(ab, what) {
    var key = what + "_parent";
    var parent = ab[key];
    if (!ab.char[parent])
        return 0;
    return ab.char[parent][what];
};

var totalValue = function(ab) {
    var sp2 = valueOf(ab, 'speciale2');
    if (ab.fixed_bonus)
        sp2 = ab.fixed_bonus;
    if (!ab.total)
        return getValoreGradi(ab) + valueOf(ab, 'oggetto') + valueOf(ab, 'speciale1') + sp2;
    var children = _.filter(abilities, function(a, key) {
        if (a.gradi5_parent == ab.key) {
            a.char = ab.char;
            a.key = key;
            return a;
        }
    });
    var max = _.max(children, function(child) {
        return totalValue(child);
    });
    return totalValue(max);
};

var isdirty = function(ab, what) {
    var dirty = Session.get('dirty');
    if (!dirty || !dirty[ab.key] || !dirty[ab.key][what])
        return false;
    return true;
};

var iserror = function(ab, what) {
    var error = Session.get('errors')
    if (!error || !error[ab.key] || !error[ab.key][what])
        return false;
    return true;
};

Template.ability.valore_gradi = function () {
    return getValoreGradi(this);
};

Template.ability.totale = function() {
    return totalValue(this);
};

Template.ability.studio_max = function() {
    if (this.studio) {
        return this.char.IN + this.studio;
    }
    return "";
};

Template.ability.valueOf = function(what) {
    return valueOf(this, what);
};

Template.ability.statusClass = function(what) {
    var dirty = isdirty(this, what);
    var error = isdirty(this, what);
    if (error)
        return "error";
    if (dirty)
        return "warning";
    return "";
};

Template.ability.has = function (what) {
    if (this[what]) return true;
    return false;
};

Template.ability.parent_value = function(what) {
    return parentValue(this, what);
};
