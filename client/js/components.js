
Vue.component("avt-loginform", {
    props: [ "isloggedin", "logourl", "title" ],
    template:
        '<div class="loginform" v-if="!isloggedin">' +
            '<form v-on:submit.prevent="login">' +
                '<div class="logo"><img v-bind:src="logourl"/></div>' +
                '<h1>{{title}}</h1>' +
                '<avt-textinput autofocus="autofocus" tabindex="1" v-model="username" label="Benutzername"></avt-textinput>' +
                '<avt-passwordinput tabindex="2" v-model="password" label="Passwort"></avt-passwordinput>' +
                '<div class="buttonrow"><button type="submit" tabindex="3">Anmelden</button></div>' +
                '<div class="version">{{version}}</div>' +
            '</form>' +
        '</div>',
    data: function() { return {
        username: "",
        password: "",
        version: "2.0"
    }},
    methods: {
        login: function() {
            this.$emit('login', { username: this.username, password: this.password }), "FURZ";
        }
    }
});

Vue.component("avt-passwordinput", {
    props: [ "label", "value", "tabindex" ],
    template: '<div class="inputcontainer"><label>{{label}}</label><input type="password" v-bind:tabindex="tabindex" v-model="internalvalue"/></div>',
    data: function() { return { internalvalue: this.value }},
    watch: { internalvalue(val) { this.$emit('input', val); } }
});

Vue.component("avt-textinput", {
    props: [ "autofocus", "label", "value", "tabindex" ],
    template: '<div class="inputcontainer"><label>{{label}}</label><input type="text" v-bind:autofocus="autofocus" v-bind:tabindex="tabindex" v-model="internalvalue"/></div>',
    data: function() { return { internalvalue: this.value }},
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
