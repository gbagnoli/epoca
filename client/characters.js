// UTILS
var m = function(a, b) {
    return Math.floor((a + b) / 2);
};

var seduzione = function(character) {
    if (character.AS < 0)
        bonus = character.AS * 5;
    else
        bonus = character.AS;
    fragco = Math.floor((character.FR + character.AG + character.CO) / 3);
    return character.aspetto + bonus + fragco + character.IN + character.PR + m(character.IN, character.AS);
};

// Characters
Template.characters.anyCharacters = function() {
    return Characters.find().count() > 0;
};

Template.characters.characters = function() {
    return Characters.find();
};

Template.characters.error = function() {
    return Session.get("error");
};

Template.characters.char_to_remove= function() {
    return Session.get("removechar");
}

Template.characters.events({
    'click #newCharSubmit': function(event) {
        var data = {owner: Meteor.user()._id};
        var formData = $('#newChar').serializeArray();

        for (var d in formData) {
            var field = formData[d];
            if (!field.value) {
                Session.set("error", field.name + " non specificato");
                return false;
            }

            switch (field.name) {
                case "Nome":
                    data['nome'] = field.value;
                    break;
                case "Razza":
                    data['razza'] = field.value;
                    break;
                case "Sesso":
                    data['sesso'] = field.value;
            }
        }
        if (Characters.findOne({nome: data['nome']})) {
            Session.set("error", "Personaggio già esistente");
            return;
        }
        // XXX: LOG!
        Characters.insert(data);
        $('#newChar')[0].reset();
    },
    'click #dismissAlert': function (event) {
        Session.set("error", false);
        $('.alert').alert('close');
    },
    'click .remove-char': function (event) {
        var node;
        // Always get the button, not the icon
        if (!event.currentTarget)
            node = event.target;
        else
            node = event.currentTarget;
        node = $(node);
        var charName = node.attr('character');
        bootbox.confirm("Sei sicuro di voler eliminare " + charName + "??", function(result) {
            if (result) {
                // XXX LOG
                Characters.remove({nome: charName});
            }
        });
    }
});

Template.characters.ownerName = function(owner) {
    var user = Meteor.users.findOne({'_id': owner});
    if (user)
        return displayName(user);
    return "???";
};
Template.character404.character = function() { return Session.get('characterId'); };

// Character
var TC = Template.character;

// Form Status
TC.ownerName = Template.characters.ownerName;
TC.character = function() { return Session.get('character'); };
TC.rendered = function() {
  var tooltips = $("[rel=tooltip]");
  if (tooltips.length) tooltips.tooltip();
  var tab = Session.get('activeTab');
  if (!tab)
      tab = "linkcaratteristiche";

  console.log("Activating " + tab);
  console.log($('#' + tab));
  $('#' + tab).tab("show");
};

TC.isActive = function (tab) {
    var current = Session.get('currentTab');
    if (tab == current)
        return true;
    return false;
};

TC.dirty = function() {
    if (Session.get("dirty")) return true;
    else return false;
};
TC.error = function() {
    if (Session.get("errors")) return true;
    return false;
};
TC.submittable = function() {
    if (TC.dirty() && !TC.error())
        return true;
    return false;
};
TC.changed = function () {
    if (TC.dirty() || TC.error())
        return true;
    return false;
};
TC.isdirty = function(what) {
    var dirty = Session.get('dirty');
    if (!dirty || !dirty[what])
        return false;

    return true;
};
TC.iserror = function(what) {
    var errors = Session.get('errors');
    if (!errors || !errors[what])
        return false;

    return true;
};
TC.statusClass = function(what) {
    var dirty = TC.isdirty(what);
    var error = TC.iserror(what);
    if (error)
        return "error";

    if (dirty)
        return 'warning';

    return "";
};

// Caratteristiche
TC.is_male = function () { return this.sesso == "m"; };
TC.carisma = function () { return this.PR + m(this.IN, this.AS); };
TC.disciplina = function () { return this.PR + this.IT; };
TC.movimento = function () { return this.AG + this.FR; };
TC.reazione = function () { return this.PR + m(this.PR, this.AG); };
TC.vita = function () { return this.FR + this.CO; };
TC.volonta = function () { return this.IN + this.IT; };
TC.punti_sviluppo_max = function () { return 0; };
TC.punti_sviluppo_min = function () { return 0; };
TC.saggezza = function () {
  if (this.eta < 36)
      return 0;
  else if (this.eta < 66)
      return Math.floor((this.eta - 32) / 4);
  else
      return 8 + Math.floor((this.eta - 66) / 2);
};
TC.seduzione = function () {
    return seduzione(this);
};
TC.seduzione_total = function () {
    var bonus = this.mod_seduzione;
    if (!bonus)
        bonus = 0;
    return seduzione(this) + bonus;
};
TC.C = function () {
   // Par 6.2.1 - p 289 (303)
   if (this.eta < 35) {
       return Math.ceil(this.eta / 3);
   } else {
       return 12 + Math.ceil((this.eta - 35) / 2);
   }
};
TC.sortedLingue = function () {
    return _.sortBy(Session.get('character').lingue,
                    function(lingua) { return -lingua.competenza; });
};
// Abilità
TC.abilities = function () {
    var char = Session.get('character');
    return _.map(abilities, function(val, key) {
        var cl = _.clone(val);
        cl.key = key;
        cl.char = char;
        return cl;
    });
};

Template.character.events({
    'keypress input' : function(event) {
        if (event.keyCode == '13' && event.target.id) {
            $('#' + event.target.id).blur();
        }
    },
    'click a.tablink': function(event) {
        event.stopPropagation();
        var anchor = event.target.id;
        Session.set('activeTab', anchor);
        $(event.target).tab("show");
    },
    'click #save': function(event) {
        if (Session.get('dirty') && !Session.get("errors")) {
            // XXX LOG
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
    },
    'click #newLangButton': function(event) {
        $('#langFormLabel').html("Nuova Lingua");
        $('#langForm').modal();
    },
    'click button.edit-lang': function(event) {
        var node;
        if (!event.currentTarget)
            node = event.target;
        else
            node = event.currentTarget;
        node = $(node);
        var lang = node.attr('lang');
        var char = Session.get('character');
        $('#langFormLabel').html("Modifica Lingua");
        _.each(char.lingue, function(e, k, l) {
            if (e.nome == lang) {
                $('#langFormNome').val(e.nome);
                $('#langFormSviluppo').val(e.sviluppo);
                $('#langFormCompetenza').val(e.competenza);
            }
        });
        $('#langForm').modal();
    },
    'click #langFormSave': function (event) {
        event.stopPropagation();
        var data = {};
        var error = false;
        _.each($('#langForm input'), function (e, k, l) {
            var elem = $(e);
            var cgroup = $(elem.parents()[0]);
            cgroup.removeClass('error');
            value = elem.val();
            if (elem.attr("name") == "nome") {
                if (!value) {
                    error = true;
                    cgroup.addClass('error');
                }
            } else {
                value = parseInt(value);
                if (isNaN(value)) {
                    cgroup.addClass('error');
                    error = true;
                } else if (elem.attr("name") == "competenza") {
                    if (value > 5) {
                        cgroup.addClass('error');
                        error = true;
                    }
                }
            }
            data[elem.attr('name')] = value;
        });
        if (!error) {
            var char = Session.get('character');
            // XXX LOG!
            Characters.update({"_id": char._id,
                              "lingue.nome": data['nome']},
                              {$pull: {'lingue': {"nome": data['nome'] }}});
            Characters.update(char._id, {$push: {'lingue' : data}});
            $('#langForm').modal('hide');
        }
    },
    'click button.remove-lang': function(event) {
        if (!event.currentTarget)
            node = event.target;
        else
            node = event.currentTarget;
        lingua = $(node).attr('lang')
        bootbox.confirm('Sicuro di voler rimuovere ' + lingua + "?",
                        function (result) {
                            if (result) {
                                // XXX LOG!
                                Characters.update({"_id": Session.get('character')._id,
                                                  "lingue.nome": lingua.nome},
                                                  {$pull: {'lingue': {"nome": lingua }}}
                                );
                            }
                        });
    },
    'changed input, blur input': function(event) {
        var id = event.target.id;
        if (!id)
            return;

        var jElem = $(event.target);
        var autosave = jElem.attr('autosave');
        if (autosave == "false")
            return;
        var value = jElem.val();
        var dirty = Session.get('dirty') || {};
        var char = Session.get('character');
        var errors = Session.get('errors') || {};
        if (id.indexOf('-') > 0) {
            var char_key = id.split("-")[0];
            var key = id.split("-")[1];
            var currentValue = null;
            if (char[char_key])
                currentValue = char[char_key][key];
            var dirtyValue = null;
            if (dirty[char_key])
                dirtyValye = dirty[char_key][key]
        } else {
            var char_key = null;
            var key = id
            var currentValue = char[key];
            var dirtyValue = dirty[key];
        }
        var set_value = function (w, k, v) {
            if (char_key) {
                if (!w[char_key])
                    w[char_key] = {};
                w[char_key][k] = v;
            } else {
                w[k] = v;
            }
        }
        var delete_value = function(w, k) {
            if (char_key) {
                if (w[char_key])
                    delete w[char_key][k];
                if (jQuery.isEmptyObject(w[char_key]))
                    delete w[char_key];
            } else {
                delete w[k];
            }
        }

        if (jElem.attr('value-type') && jElem.attr('value-type') == 'int') {
            value = parseInt(value);
            if (isNaN(value)) {
                set_value(errors, key, true);
                Session.set('errors', errors);
                return false;
            }
        }
        delete_value(errors, key);
        if (jQuery.isEmptyObject(errors))
            errors = null;
        Session.set('errors', errors);

        if (!dirtyValue)  {
            if (currentValue != value) {
                console.log("Setting " + id + " dirty: " + currentValue + " -> " + value);
                set_value(dirty, key, value);
                Session.set("dirty", dirty);
            }
        } else {
            if (currentValue == value) {
                console.log("Removing " + id + " from dirty.");
                delete_value(dirty, key);
                if (jQuery.isEmptyObject(dirty))
                    dirty = null;
                Session.set("dirty", dirty);
            } else if (dirtyValue != value) {
                console.log("Updating dirty value: " + dirtyValue + " -> " + value);
                set_value(dirty, key, value);
                Session.set('dirty', dirty);
            }
        }
    }
});
