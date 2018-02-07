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
    clients: {},
    clientsettings: {},
    documents: {},
    fmobjects: {},
    notes: {},
    persons: {},
    portalsettings: {},
    usergroups: {},
    users: {},
    usersettings: {},

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
    logourl: "",
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
    logourl: "",
    isportal: true
};
