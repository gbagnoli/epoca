var abilities = {
    'conoscenza_metalli_rocce' : {
        "attribute" : "IT",
        "studio": 80,
        "fixed_bonus": null,
        "bonus_gradi": null,
        "gradi5": 10,
        "gradi3": 10,
        "gradi1": true,
        "nome": "Conoscenza Metalli e Rocce"
    },
    'conoscenza_mondo_animale' : {
        "attribute" : "[IT+PR]",
        "studio": 80,
        "fixed_bonus": null,
        "bonus_gradi": null,
        "gradi5": 10,
        "gradi3": 10,
        "gradi1": true,
        "nome": "Conoscenza del Mondo Animale"
    },
    'conoscenza_mondo_vegetale' : {
        "attribute" : "IT",
        "studio": 80,
        "fixed_bonus": null,
        "bonus_gradi": null,
        "gradi5": 10,
        "gradi3": 10,
        "gradi1": true,
        "nome": "Conoscenza del Mondo Vegetale"
    },
    'cultura_generale' : {
        "attribute" : "[IT + PR]",
        "studio": null,
        "fixed_bonus": null,
        "bonus_gradi": null,
        "gradi5": 10,
        "gradi3": null,
        "gradi1": null,
        "total": "max_children",
        "nome": "Cultura Generale"
    },
    'usi_e_costumi' : {
        "attribute" : null,
        "studio": null,
        "fixed_bonus": null,
        "bonus_gradi": null,
        "gradi5": null,
        "gradi5_parent": "cultura_generale",
        "gradi3": 10,
        "gradi1": true,
        "nome": "Usi e Costumi"
    },
    'luoghi_e_vie' : {
        "attribute" : null,
        "studio": null,
        "fixed_bonus": null,
        "bonus_gradi": null,
        "gradi5": null,
        "gradi5_parent": "cultura_generale",
        "gradi3": 10,
        "gradi1": true,
        "nome": "Luoghi e Vie"
    },
    'miti_e_leggende' : {
        "attribute" : null,
        "studio": null,
        "fixed_bonus": null,
        "bonus_gradi": null,
        "gradi5": null,
        "gradi5_parent": "cultura_generale",
        "gradi3": 10,
        "gradi1": true,
        "nome": "Miti e Leggende"
    }
};

