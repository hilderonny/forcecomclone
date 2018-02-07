module.exports.fieldtypes = {

    boolean: "boolean",
    datetime: "datetime",
    decimal: "decimal",
    text: "text"

};

var menuitems = {

    activities: {},
    areas: {},
    businesspartners: {},
    clients: { icon: "Briefcase.svg", title: "Mandanten" },
    clientsettings: {},
    documents: {},
    fmobjects: {},
    notes: {},
    persons: {},
    portalsettings: { icon: "Server.svg", title: "Portaleinstellungen" },
    usergroups: { icon: "User Group Man Man.svg", title: "Benutzergruppen" },
    users: { icon: "User.svg", title: "Benutzer" },
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
