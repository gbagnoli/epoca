var abilities = {
    'conoscenza_metalli_rocce' : {
        "attribute" : "IT",
        "studio": 80,
        "speciale_fisso": null,
        "bonus_gradi": null,
        "nome": "Conoscenza Metalli e Rocce"
    }
};

var valueOf = function(ab, what) {
    if (!ab.char[ab.key])
        return 0;
    var value = ab.char[ab.key][what];
    if (isNaN(value))
        return 0;
    return value;
};

var getValoreGradi = function(ab) {
    return (valueOf(ab, 'gradi5') * 5) + (valueOf(ab, 'gradi3') * 3) + valueOf(ab, 'gradi1');
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
    return getValoreGradi(this) + valueOf(this, 'oggetto') + valueOf(this, 'speciale1') + valueOf(this, 'speciale2');
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

