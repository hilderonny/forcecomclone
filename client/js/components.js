
Vue.component("avt-dashboard", {
    props: [ "menu" ],
    template: 
        '<div class="dashboard">' +
            '<button class="action" v-for="item in flatmenu" v-on:click="$emit(\'select\', item.card)"><img v-bind:src="\'/css/icons/office/\'+item.icon"/><span>{{item.title}}</span></button>' +
        '</div>',
    computed: {
        flatmenu: function() { 
            var items = [];
            this.menu.sections.forEach(function(section) {
                section.items.forEach(function(item) { items.push(item); });
            });
            return items;
        }
    }
});

Vue.component("avt-detailscard", {
    props: [ "elementmodel" ],
    template:
        '<div class="card details">' +
        '<div class="toolbar"></div>' +
        '<div class="title">{{title}}</div>' +
        '<div class="content">' +
            '<avt-input v-for="(field, index) in sortedfields" v-bind:key="field.name" v-bind:field="field" v-bind:value="element[field.name]" v-bind:tabindex="index"></avt-input>' +
        '</div>' +
    '</div>',
    data: function() { return {
        title: null,
        fields: [],
        element: null,
    }},
    computed: {
        sortedfields: function() { return this.fields.sort(function(a,b) { return a.label<b.label ? -1 : a.label>b.label ? 1 : 0; })}
    },
    mounted: function () {
        var self = this;
        $get("/api/datatypes/" + self.elementmodel.datatype, function(err, datatype) {
            $get("/api/datatypefields/" + self.elementmodel.datatype, function(err, fields) {
                if (datatype.name === "users") fields.find(function(f) { return f.name==="password"; }).label = "Neues Passwort";
                var titlefield = fields.find(function(f) { return f.istitle; });
                var titlefieldname = titlefield ? titlefield.name : "name";
                if (self.elementmodel && self.elementmodel.name) {
                    $get("/api/dynamic/" + self.elementmodel.datatype + "/" + self.elementmodel.name, function(err, element) {
                        self.element = element;
                        self.fields = fields;
                        self.title = element[titlefieldname];
                    });
                } else {
                    self.element = {};
                    self.fields = fields;
                    self.title = datatype.label + " erstellen";
                }
            });
        });
    }
});

Vue.component("avt-dialog", {
    props: [ "title", "message", "buttontext" ],
    template: '<div class="dialog"><h2>{{title}}</h2><p>{{message}}</p><div class="buttonrow"><button class="action primary" v-on:click.prevent="dismiss">{{buttontext}}</button></div></div>',
    methods: { dismiss: function() { this.$emit('dismisswarning'); } }
});

Vue.component("avt-input", {
    props: [ "field", "value", "tabindex" ],
    template: 
        '<div class="inputcontainer" v-bind:class="[field.fieldtype, {hasfocus:hasfocus,hascontent:internalvalue}]">' +
            '<input v-bind:id="field.name" v-if="field.fieldtype===\'boolean\'" type="checkbox" v-bind:tabindex="tabindex" v-model="internalvalue"/>' +
            '<label v-bind:for="field.name">{{field.label}}</label>' +
            '<input v-bind:id="field.name" v-if="field.fieldtype===\'text\'" type="text" v-bind:tabindex="tabindex" v-bind:placeholder="field.label" v-model="internalvalue" v-on:focus="hasfocus=true" v-on:blur="hasfocus=false"/>' +
            '<select v-if="field.fieldtype===\'reference\'"></select>' +
        '</div>',
    data: function() { return { internalvalue: this.value, hasfocus: false }},
    watch: { internalvalue(val) { this.$emit('change', val); } }
});

Vue.component("avt-listcard", {
    props: [ "datatype" ],
    template:
        '<div class="module"><div class="card">' +
            '<div class="toolbar"><button v-on:click="select()"><img src="/css/icons/material/Plus Math.svg"/><span>{{addlabel}}</span></button></div>' +
            '<div class="title" v-if="title">{{title}}</div>' +
            '<div class="content"><div class="list">' +
                '<button v-bind:class="{selected:element.model&&currentelement&&(element.model.name===currentelement.name)}" v-for="element in elements" v-on:click="select(element.model.name)"><img v-bind:src="element.icon"/><span>{{element.firstline}}</span></button>' +
            '</div></div>' +
        '</div>' +
        '<avt-detailscard v-if="currentelement" v-bind:elementmodel="currentelement"></avt-detailscard></div>',
    data: function() { return {
        addlabel: [],
        elements: [],
        fields: [],
        title: [],
        currentelement: null,
    }},
    methods: {
        select: function(name) {
            this.currentelement = null;
            this.$nextTick(function () { this.currentelement = { name: name, datatype: this.datatype }; });
        }
    },
    mounted: function () {
        var self = this;
        $get("/api/datatypes/" + self.datatype, function(err, datatype) {
            self.title = datatype.plurallabel;
            self.addlabel = datatype.label;
            $get("/api/datatypefields/" + self.datatype, function(err, fields) {
                var titlefield = fields.find(function(f) { return f.istitle; });
                var titlefieldname = titlefield ? titlefield.name : "name";
                $get("/api/dynamic/" + self.datatype, function(err, elements) {
                    self.elements = elements.map(function(element) {
                        return {
                            firstline: element[titlefieldname],
                            icon: datatype.icon,
                            model: element
                        }
                    });
                });
            });
        });
    }
});

Vue.component("avt-loginform", {
    props: [ "isloggedin", "logourl", "title", "showwarning", "version" ],
    template:
        '<form class="loginform" v-if="!isloggedin" v-on:submit.prevent="login">' +
            '<div class="logo"><img v-bind:src="logourl"/></div>' +
            '<h1>{{title}}</h1>' +
            '<avt-textinput autofocus="autofocus" tabindex="1" v-model="username" label="Benutzername"></avt-textinput>' +
            '<avt-passwordinput tabindex="2" v-model="password" label="Passwort"></avt-passwordinput>' +
            '<div class="buttonrow"><button class="action primary" type="submit" tabindex="3">Anmelden</button></div>' +
            '<div class="version">{{version}}</div>' +
            '<avt-dialog title="Anmeldung fehlgeschlagen" message="Der Benutzername oder das Passwort ist nicht korrekt." buttontext="Wiederholen" v-on:dismisswarning="dismisswarning" v-if="showwarning"></avt-dialog>' +
        '</form>',
    data: function() { return {
        username: "",
        password: ""
    }},
    methods: {
        login: function() { this.$emit('login', { username: this.username, password: this.password }); },
        dismisswarning: function() { this.$emit('dismisswarning'); }
    }
});

Vue.component("avt-mainmenu", {
    props: [ "menu" ],
    template: 
        '<div class="mainmenu">' +
            '<div class="logo"><img v-bind:src="menu.logourl" v-on:click="$emit(\'select\')"/></div>' +
            '<div class="section" v-for="section in menu.sections">' +
                '<h3>{{section.title}}</h3>' +
                '<button v-for="item in section.items" v-on:click="$emit(\'select\', item.card)"><img v-bind:src="\'/css/icons/material/\'+item.icon"/><span>{{item.title}}</span></button>' +
            '</div>' +
            '<div class="section"><button v-on:click="$emit(\'logout\')"><img src="/css/icons/material/Exit.svg"/><span>Abmelden</span></button></div>' +
            '<div class="username">Angemeldet als {{menu.username}}</div>' +
        '</div>'
});

Vue.component("avt-passwordinput", {
    props: [ "label", "value", "tabindex" ],
    template: '<div class="inputcontainer password" v-bind:class="{hasfocus:hasfocus,hascontent:internalvalue}"><label>{{label}}</label><input type="password" v-bind:tabindex="tabindex" v-bind:placeholder="label" v-model="internalvalue" v-on:focus="hasfocus=true" v-on:blur="hasfocus=false"/></div>',
    data: function() { return { internalvalue: this.value, hasfocus: false }},
    watch: { internalvalue(val) { this.$emit('input', val); } }
});

Vue.component("avt-textinput", {
    props: [ "autofocus", "label", "value", "tabindex" ],
    template: '<div class="inputcontainer text" v-bind:class="{hasfocus:hasfocus,hascontent:internalvalue}"><label>{{label}}</label><input type="text" v-bind:autofocus="autofocus" v-bind:tabindex="tabindex" v-bind:placeholder="label" v-model="internalvalue" v-on:focus="hasfocus=true" v-on:blur="hasfocus=false"/></div>',
    data: function() { return { internalvalue: this.value, hasfocus: this.autofocus }},
    watch: { internalvalue(val) { this.$emit('input', val); } }
});

Vue.component("avt-toolbar", {
    props: [ "isloggedin", "isportal", "title" ],
    template: '<div class="toolbar" v-bind:class="toolbarclass">{{isloggedin?title:""}}</div>',
    computed: {
        toolbarclass: function() { return {
            transparent: !this.isloggedin,
            portal: this.isloggedin && this.isportal
        }}
    }
});
