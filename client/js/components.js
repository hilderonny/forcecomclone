
Vue.component("avt-dashboard", {
    props: [ "menu" ],
    template: 
        '<div class="dashboard">' +
            '<button class="action" v-for="item in flatmenu" v-on:click="selectmodule(item.module)"><img v-bind:src="\'/css/icons/office/\'+item.icon"/><span>{{item.title}}</span></button>' +
        '</div>',
    computed: {
        flatmenu: function() { 
            var items = [];
            this.menu.sections.forEach(function(section) {
                section.items.forEach(function(item) { items.push(item); });
            });
            return items;
        }
    },
    methods: {
        selectmodule: function(mod) { this.$emit('selectmodule', mod); }
    }
});

Vue.component("avt-dialog", {
    props: [ "title", "message", "buttontext" ],
    template: '<div class="dialog"><h2>{{title}}</h2><p>{{message}}</p><div class="buttonrow"><button class="action primary" v-on:click.prevent="dismiss">{{buttontext}}</button></div></div>',
    methods: { dismiss: function() { this.$emit('dismisswarning'); } }
});

Vue.component("avt-listcard", {
    props: [ "listelements", "title" ],
    template:
        '<div class="card">' +
            '<div class="toolbar"></div>' +
            '<div class="title" v-if="title">{{title}}</div>' +
            '<div class="content"><div class="list">' +
                '<button v-for="element in listelements" v-on:click="selectelement(element)"><img v-bind:src="element.icon"/><span>{{element.firstline}}</span></button>' +
            '</div></div>' +
        '</div>',
    methods: {
        selectelement: function(element) { this.$emit('elementselected', element); }
    }
})

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
            '<div class="logo"><img v-bind:src="menu.logourl" v-on:click="selectmodule(null)"/></div>' +
            '<div class="section" v-for="section in menu.sections">' +
                '<h3>{{section.title}}</h3>' +
                '<button v-for="item in section.items" v-on:click="selectmodule(item.module)"><img v-bind:src="\'/css/icons/material/\'+item.icon"/><span>{{item.title}}</span></button>' +
            '</div>' +
            '<div class="section"><button v-on:click="logout"><img src="/css/icons/material/Exit.svg"/><span>Abmelden</span></button></div>' +
            '<div class="username">Angemeldet als {{menu.username}}</div>' +
        '</div>',
    methods: {
        logout: function() { this.$emit('logout'); },
        selectmodule: function(mod) { this.$emit('selectmodule', mod); }
    }
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
