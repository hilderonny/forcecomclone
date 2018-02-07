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
    clients: { icon: "/css/icons/material/Briefcase.svg", title: "Mandanten" },
    clientsettings: {},
    documents: {},
    fmobjects: {},
    notes: {},
    persons: {},
    portalsettings: { icon: "/css/icons/material/Server.svg", title: "Portaleinstellungen" },
    usergroups: { icon: "/css/icons/material/User Group Man Man.svg", title: "Benutzergruppen" },
    users: { icon: "/css/icons/material/User.svg", title: "Benutzer" },
    usersettings: { icon: "/css/icons/material/Settings.svg", title: "Mein Profil" },

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
