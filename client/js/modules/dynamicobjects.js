
Vue.component("avt-dynamicobjects-list", {
    template: 
        '<avt-listcard v-bind:listelements="listmodel" title="Dynamische Objekte" v-on:elementselected="elementselected">' +
            '<button slot="toolbar" v-on:click="add"><img src="/css/icons/material/Plus Math.svg"/><span>Dynamisches Objekt</span></button>' +
        '</avt-listcard>',
    data: function() { return {
        dynamicobjects: []
    }},
    computed: {
        listmodel: function() { return this.dynamicobjects.map(function(dynamicobject) {
            return {
                firstline: dynamicobjects.name,
                icon: "/css/icons/material/categorize.svg",
                model: dynamicobject
            }
        }); }
    },
    methods: {
        add: function(element) { console.log("New DO"); },
        elementselected: function(element) { console.log(element); }
    },
    mounted: function () {
        var self = this;
        $get("/api/dynamic/WTF", function(err, res) {
            self.dynamicobjects = res;
        });
    }
});
