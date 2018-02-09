module.exports.fieldtypes = {

    boolean: "boolean",
    datetime: "datetime",
    decimal: "decimal",
    reference: "reference",
    text: "text"

};

var menuitems = {

    activities: {},
    areas: {},
    businesspartners: {},
    clients: { icon: "Briefcase.svg", card: "avt-clients-list", title: "Mandanten" },
    clientsettings: {},
    documents: {},
    dynamicobjects: { icon: "categorize.svg", card: "avt-dynamicobjects-list", title: "Dynamische Objekte" },
    fmobjects: {},
    notes: {},
    persons: {},
    portalsettings: { icon: "Server.svg", title: "Portaleinstellungen" },
    usergroups: { icon: "user-account.svg", card: "avt-usergroups-list", title: "Benutzergruppen" },
    users: { icon: "user.svg", card: "avt-users-list", title: "Benutzer" },
    usersettings: { icon: "Settings.svg", title: "Mein Profil" },

};

module.exports.menuitems = menuitems;

module.exports.clientmenustructure = {
    sections: [
        { 
            title: "Administration",
            items: [ 
                menuitems.users, 
                menuitems.usergroups, 
                menuitems.clientsettings, 
                menuitems.dynamicobjects,
                menuitems.usersettings 
            ]
        },
        { 
            title: "Büro",
            items: [ 
                menuitems.documents, 
                menuitems.activities, 
                menuitems.notes 
            ]
        },
        { 
            title: "FM",
            items: [ 
                menuitems.fmobjects, 
                menuitems.areas 
            ]
        },
        { 
            title: "CRM",
            items: [ 
                menuitems.businesspartners, 
                menuitems.persons 
            ]
        }
    ],
    logourl: "css/images/logo_avorium_komplett.svg",
    isportal: false
};

module.exports.portalmenustructure = {
    sections: [
        { 
            title: "Administration",
            items: [ 
                menuitems.users, 
                menuitems.usergroups, 
                menuitems.dynamicobjects,
                menuitems.usersettings 
            ]
        },
        { 
            title: "Portal",
            items: [ 
                menuitems.portalsettings, 
                menuitems.clients
            ]
        }
    ],
    logourl: "css/images/logo_avorium_komplett.svg",
    isportal: true
};
