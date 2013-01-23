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
    'click #removeCharConfirmBtn': function(event) {
        var charName = Session.get('removechar');
        console.log("Rimuovo " + charName);
        // XXX LOG!
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
        Characters.remove({nome: charName});
    }
});

Template.characters.ownerName = function(owner) {
    var user = Meteor.users.findOne({'_id': owner});
    if (user)
        return displayName(user);
    return "???";
};
Template.character404.character = function() { return Session.get('characterId'); };


var TC = Template.character;

TC.ownerName = Template.characters.ownerName;
TC.character = function() { return Session.get('character'); };
TC.rendered = function() {
  var tooltips = $("[rel=tooltip]");
  if (tooltips.length) tooltips.tooltip();
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

Template.character.events({
    'keypress input' : function(event) {
        if (event.keyCode == '13' && event.target.id) {
            $('#' + event.target.id).blur();
        }
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
            jfield.val(jfield[0].attributes['value'].value);
        };
        var errors = Session.get('errors');
        var dirty = Session.get('dirty');
        if (errors) {
            for (var error in errors) {
                clear(error);
            }
        }
        if (dirty) {
            for (var field in dirty) {
                clear(field);
            }
        }
        Session.set('dirty', null);
        Session.set('errors', null);
    },
    'click #newLangButton': function(event) {
        $('#langFormLabel').html("Nuova Lingua");
        $('#langFormForm')[0].reset()
        $('#langForm').modal();
        $('#langForm').on('hide', function () {
            var char = Session.get('character')
        });
    },
    'changed input, blur input': function(event) {
        var id = event.target.id;
        if (!id)
            return;

        var jElem = $('#' + id);
        var autosave = jElem.attr('autosave');
        if (autosave == "false")
            return;
        var value = jElem.val();
        var dirty = Session.get('dirty') || {};
        var char = Session.get('character');
        var currentValue = char[id];
        var dirtyValue = dirty[id];
        var errors = Session.get('errors') || {};
        if (event.target.attributes['value-type'] && event.target.attributes['value-type'].value == 'int') {
            value = parseInt(value);
            if (isNaN(value)) {
                errors[id] = true;
                Session.set('errors', errors);
                return false;
            }
        }
        delete errors[id];
        if (jQuery.isEmptyObject(errors))
            errors = null;
        Session.set('errors', errors);

        if (!dirtyValue)  {
            if (currentValue != value) {
                console.log("Setting " + id + " dirty: " + currentValue + " -> " + value);
                dirty[id] = value;
                Session.set("dirty", dirty);
            }
        } else {
            if (currentValue == value) {
                console.log("Removing " + id + " from dirty.");
                delete dirty[id];
                if (jQuery.isEmptyObject(dirty))
                    dirty = null;
                Session.set("dirty", dirty);
            } else if (dirtyValue != value) {
                console.log("Updating dirty value: " + dirtyValue + " -> " + value);
                dirty[id] = value;
                Session.set('dirty', dirty);
            }
        }
    }
});
