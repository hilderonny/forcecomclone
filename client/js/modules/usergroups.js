
Vue.component("avt-usergroup-list", {
    template: 
        '<div class="module">' +
            '<avt-listcard v-bind:listelements="listmodel" title="Benutzergruppen" v-on:elementselected="elementselected"></avt-listcard>' +
        '</div>',
    data: function() { return {
        usergroups: []
    }},
    computed: {
        listmodel: function() { return this.usergroups.map(function(usergroup) {
            return {
                firstline: usergroup.name,
                icon: "/css/icons/material/User Group Man Man.svg",
                model: usergroup
            }
        }); }
    },
    methods: {
        elementselected: function(element) { console.log(element); }
    },
    mounted: function () {
        var self = this;
        $get("/api/dynamic/usergroups", function(err, res) {
            self.usergroups = res;
        });
    }
});
