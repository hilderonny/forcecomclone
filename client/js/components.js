
Vue.component("avt-dashboard", {
    template: 
        '<div v-if="isloggedin&&!activemodule" class="dashboard">' +
            '<button class="action" v-for="item in flatmenu" v-on:click="$emit(\'select\', item.card)"><img v-bind:src="\'/css/icons/office/\'+item.icon"/><span>{{item.title}}</span></button>' +
        '</div>',
    computed: {
        activemodule: function() { return Store.state.activemodule; },
        isloggedin: function() { return Store.state.isloggedin; },
        flatmenu: function() { 
            var items = [];
            if (Store.state.menu) Store.state.menu.sections.forEach(function(section) {
                section.items.forEach(function(item) { items.push(item); });
            });
            return items;
        },
    }
});

Vue.component("avt-detailscard", {
    props: [ "elementmodel" ],
    template:
        '<div class="card details">' +
            '<div class="toolbar"></div>' +
            '<div class="title">{{title}}</div>' +
            '<div class="content">' +
                '<avt-input v-for="(field, index) in sortedfields" v-bind:key="field.name" v-bind:field="field" v-bind:value="element[field.name]" v-bind:tabindex="index" v-on:change="change"></avt-input>' +
                '<div class="buttonrow"><button class="action warn" v-if="!isnew&&canwrite" v-on:click="$emit(\'block\');showdeletequestion=true">Löschen</button><button class="action primary" v-if="!isnew&&canwrite" v-on:click="saveelement">Speichern</button><button class="action primary" v-if="isnew&&canwrite" v-on:click="createelement">Erstellen</button></div>' +
            '</div>' +
            '<avt-yesnodialog title="Objekt löschen" question="Soll das Objekt wirklich gelöscht werden?" v-on:yes="deleteelement" v-on:no="showdeletequestion=false" v-if="showdeletequestion"></avt-yesnodialog>' +
        '</div>',
    data: function() { return {
        canwrite: false,
        element: null,
        fields: [],
        isnew: false,
        showdeletequestion: false,
        title: null,
    }},
    computed: {
        sortedfields: function() { return this.fields.sort(function(a,b) { return a.label<b.label ? -1 : a.label>b.label ? 1 : 0; })}
    },
    methods: {
        change: function(changeevent) {
            switch (changeevent.field.fieldtype) {
                case 'reference': this.element[changeevent.field.name].value = changeevent.value; break;
                default: this.element[changeevent.field.name] = changeevent.value; break;
            }
        },
        createelement: function() {
            var self = this;
            $post("/api/dynamic/" + self.elementmodel.datatype, self.prepareforsending(), function(err, res) {
                if (err) {
                    // TODO: Handle 409 and other errors
                    console.log(err);
                    return;
                }
                // TODO: Erfolgsmeldungen ausgeben
                self.$emit('create', self.element);
            });
        },
        deleteelement: function() {
            console.log("DELETE");
            this.$emit('unblock');
            this.showdeletequestion = false;
        },
        prepareforsending: function() {
            var sendableobject = {};
            var self = this;
            self.fields.forEach(function(f) {
                switch (f.fieldtype) {
                    case 'reference': sendableobject[f.name] = self.element[f.name].value; break;
                    default: sendableobject[f.name] = self.element[f.name]; break;
                }
            });
            return sendableobject;
        },
        saveelement: function() {
            console.log("SAVE");
            console.log(this.prepareforsending());
        }
    },
    mounted: function () {
        var self = this;
        self.isnew = !(self.elementmodel && self.elementmodel.name);
        var apiurl = "/api/dynamic/" + self.elementmodel.datatype + (self.isnew ? "/empty" : "/byName/" + self.elementmodel.name);
        $get(apiurl, function(err, element) {
            self.canwrite = element.canwrite;
            self.fields = element.fields;
            var localelement = {};
            element.fields.forEach(function(f) { localelement[f.name] = element.obj[f.name]; });
            self.element = localelement;
            self.title = element.datatype.label + " " + (self.isnew ? "erstellen" : element.label);
        });
    }
});

Vue.component("avt-input", {
    props: [ "field", "value", "tabindex" ],
    template: 
        '<div class="inputcontainer" v-bind:class="[field.fieldtype, {hasfocus:hasfocus,hascontent:internalvalue}]">' +
            '<input v-bind:id="field.name" v-if="field.fieldtype===\'boolean\'" type="checkbox" v-bind:tabindex="tabindex" v-model="internalvalue"/>' +
            '<label v-bind:for="field.name">{{field.label}}</label>' +
            '<input v-bind:id="field.name" v-if="field.fieldtype===\'text\'" type="text" v-bind:tabindex="tabindex" v-bind:placeholder="field.label" v-model="internalvalue" v-on:focus="hasfocus=true" v-on:blur="hasfocus=false"/>' +
            '<select v-if="field.fieldtype===\'reference\'" v-model="internalvalue.value"><option v-for="option in internalvalue.options" v-bind:value="option.name">{{option.label}}</option></select>' +
        '</div>',
    data: function() { return { internalvalue: this.value, hasfocus: false }},
    watch: { internalvalue(val) { this.$emit('change', { field: this.field, value: val }); } }
});

Vue.component("avt-listcard", {
    props: [ "datatype" ],
    template:
        '<div class="module"><div class="card">' +
            '<div class="toolbar"><button v-if="canwrite" v-on:click="select()"><img src="/css/icons/material/Plus Math.svg"/><span>{{addlabel}}</span></button></div>' +
            '<div class="title" v-if="title">{{title}}</div>' +
            '<div class="content"><div class="list">' +
                '<button v-bind:class="{selected:currentelement&&(element.name===currentelement.name)}" v-for="element in elements" v-on:click="select(element.name)"><img v-bind:src="element.icon"/><span>{{element.firstline}}</span></button>' +
            '</div></div>' +
        '</div>' +
        '<avt-detailscard v-if="currentelement" v-bind:elementmodel="currentelement" v-on:create="create"></avt-detailscard></div>',
    data: function() { return {
        addlabel: [],
        canwrite: false,
        currentelement: null,        
        elements: [],
        fields: [],
        title: [],
    }},
    methods: {
        create: function(newelement) {
            this.load();
            this.select(newelement.name);
            console.log(newelement);
        },
        load: function() {
            var self = this;
            $get("/api/dynamic/" + self.datatype + "/forList", function(err, result) {
                self.canwrite = result.canwrite;
                self.title = result.datatype.plurallabel;
                self.addlabel = result.datatype.label;
                self.elements = result.objects.map(function(o) { return {
                    name: o.name,
                    firstline: o.firstline,
                    icon: result.datatype.icon
                }});
            });
        },
        select: function(name) {
            this.currentelement = null;
            this.$nextTick(function () { this.currentelement = { name: name, datatype: this.datatype }; });
        }
    },
    mounted: function () {
        this.load();
    }
});

Vue.component("avt-loginform", {
    template:
        '<form class="loginform" v-if="!isloggedin" v-on:submit.prevent="login">' +
            '<div class="logo"><img v-bind:src="logourl"/></div>' +
            '<h1>{{title}}</h1>' +
            '<avt-textinput autofocus="autofocus" tabindex="1" v-model="username" label="Benutzername"></avt-textinput>' +
            '<avt-passwordinput tabindex="2" v-model="password" label="Passwort"></avt-passwordinput>' +
            '<div class="buttonrow"><button class="action primary" type="submit" tabindex="3">Anmelden</button></div>' +
            '<div class="version">{{version}}</div>' +
            '<avt-messagedialog title="Anmeldung fehlgeschlagen" message="Der Benutzername oder das Passwort ist nicht korrekt." buttontext="Wiederholen" v-on:close="dismisswarning" v-if="showwarning"></avt-messagedialog>' +
        '</form>',
    data: function() { return {
        username: "",
        password: ""
    }},
    computed: { 
        isloggedin: function() { return Store.state.isloggedin; },
        logourl: function() { return Store.getters.portallogo; },
        showwarning: function() { return Store.state.isshowingloginfaileddialog; },
        title: function() { return Store.getters.portalname; },
        version: function() { return Store.getters.version; },
    },
    methods: {
        login: function() { this.$emit('login', { username: this.username, password: this.password }); },
        dismisswarning: function() { Store.commit("hideloginfaileddialog"); }
    }
});

Vue.component("avt-mainmenu", {
    template: 
        '<div v-if="isloggedin&&menu" class="mainmenu">' +
            '<div class="logo"><img v-bind:src="menu.logourl" v-on:click="$emit(\'select\')"/></div>' +
            '<div class="section" v-for="section in menu.sections">' +
                '<h3>{{section.title}}</h3>' +
                '<button v-for="item in section.items" v-on:click="$emit(\'select\', item.card)" v-bind:class="{selected:activemodule&&(activemodule===item.card)}"><img v-bind:src="\'/css/icons/material/\'+item.icon"/><span>{{item.title}}</span></button>' +
            '</div>' +
            '<div class="section"><button v-on:click="$emit(\'logout\')"><img src="/css/icons/material/Exit.svg"/><span>Abmelden</span></button></div>' +
            '<div class="username">Angemeldet als {{menu.username}}</div>' +
        '</div>',
    computed: {
        activemodule: function() { return Store.state.activemodule; },
        isloggedin: function() { return Store.state.isloggedin; },
        menu: function() { return Store.state.menu; },
    }
});

Vue.component("avt-messagedialog", {
    props: [ "title", "message", "buttontext" ],
    template: '<div class="dialog"><h2>{{title}}</h2><p>{{message}}</p><div class="buttonrow"><button class="action primary" v-on:click.prevent="close">{{buttontext}}</button></div></div>',
    methods: {
        close: function() { Store.commit("unblock"); this.$emit("close"); }
    },
    mounted: function() { Store.commit("block"); }
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
    template: '<div class="toolbar" v-bind:class="toolbarclass">{{isloggedin?title:""}}</div>',
    computed: {
        isloggedin: function() { return Store.state.isloggedin; },
        isportal: function() { return Store.getters.isportal; },
        title: function() { return Store.getters.title; },
        toolbarclass: function() { return {
            transparent: !this.isloggedin,
            portal: this.isloggedin && this.isportal
        }}
    }
});

Vue.component("avt-yesnodialog", {
    props: [ "title", "question" ],
    template: '<div class="dialog"><h2>{{title}}</h2><p>{{question}}</p><div class="buttonrow"><button class="action" v-on:click.prevent="yes">Ja</button><button class="action" v-on:click.prevent="no">Nein</button></div></div>',
    methods: {
        no: function() { Store.commit("unblock"); this.$emit("no"); },
        yes: function() { Store.commit("unblock"); this.$emit("yes"); }
    },
    mounted: function() { Store.commit("block"); }
});
