
Vue.component("avt-loginform", {
    props: [ "isloggedin", "logourl", "title", "showwarning" ],
    template:
        '<form class="loginform" v-if="!isloggedin" v-on:submit.prevent="login">' +
            '<div class="logo"><img v-bind:src="logourl"/></div>' +
            '<h1>{{title}}</h1>' +
            '<avt-textinput autofocus="autofocus" tabindex="1" v-model="username" label="Benutzername"></avt-textinput>' +
            '<avt-passwordinput tabindex="2" v-model="password" label="Passwort"></avt-passwordinput>' +
            '<div class="buttonrow"><button type="submit" tabindex="3">Anmelden</button></div>' +
            '<div class="version">{{version}}</div>' +
            '<avt-dialog title="Anmeldung fehlgeschlagen" message="Der Benutzername oder das Passwort ist nicht korrekt." buttontext="Wiederholen" v-on:dismisswarning="dismisswarning" v-if="showwarning"></avt-dialog>' +
        '</form>',
    data: function() { return {
        username: "",
        password: "",
        version: "2.0"
    }},
    methods: {
        login: function() { this.$emit('login', { username: this.username, password: this.password }); },
        dismisswarning: function() { this.$emit('dismisswarning'); }
    }
});

Vue.component("avt-dialog", {
    props: [ "title", "message", "buttontext" ],
    template: '<div class="dialog"><h2>{{title}}</h2><p>{{message}}</p><div class="buttonrow"><button v-on:click.prevent="dismiss">{{buttontext}}</button></div></div>',
    methods: { dismiss: function() { this.$emit('dismisswarning'); } }
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
    props: [ "isloggedin", "isportal" ],
    template: '<div class="toolbar" v-bind:class="toolbarclass">{{dreck}} {{isloggedin}} {{isportal}}</div>',
    data: function() { return {
        dreck: "HUPE"
    }},
    computed: {
        toolbarclass: function() { return {
            transparent: this.isloggedin,
            portal: this.isloggedin && this.isportal
        }}
    }
});
