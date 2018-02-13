var App, Store;

window.addEventListener("load", function() {

    Store = new Vuex.Store({
        state: {
            activemodule: undefined,
            hint: undefined,
            isblocked: false,
            isloggedin: false,
            isshowingloginfaileddialog: false,
            iswaiting: false,
            menu: undefined,
            portalinfo: undefined,
            token: undefined,
        },
        getters: {
            isportal: function(state) { return state.menu && state.menu.isportal; },
            portallogo: function(state) { return state.portalinfo && state.portalinfo.portallogo; },
            portalname: function(state) { return state.portalinfo && state.portalinfo.portalname; },
            title: function(state) { return state.menu && state.menu.title; },
            version: function(state) { return state.portalinfo && state.portalinfo.version; },
        },
        mutations: {
            block: function(state) { state.isblocked = true; },
            hideloginfaileddialog: function(state) { state.isshowingloginfaileddialog = false; },
            setactivemodule: function(state, activemodule) { state.activemodule = activemodule; },
            sethint: function(state, hint) {
                state.hint = hint;
                setTimeout(function() { state.hint = undefined; }, 3000);
            },
            setloggedin: function(state) { state.isloggedin = true; },
            setloggedout: function(state) { state.isloggedin = false; },
            setmenu: function(state, menu) { state.menu = menu; },
            setportalinfo: function(state, portalinfo) { state.portalinfo = portalinfo; },
            settoken: function(state, token) { state.token = token; },
            showloginfaileddialog: function(state) { state.isshowingloginfaileddialog = true; },
            startwaiting: function(state) { state.iswaiting = true; },
            stopwaiting: function(state) { state.iswaiting = false; },
            unblock: function(state) { state.isblocked = false; },
        }
    })

    App = new Vue({
        el: "#App",
        computed: {
            activemodule: function() { return Store.state.activemodule; },
            isblocked: function() { return Store.state.isblocked; },
            isloggedin: function() { return Store.state.isloggedin; },
            iswaiting: function() { return Store.state.iswaiting; },
        },
        methods: {
            loadmenu: function() {
                var self = this;
                $get("/api/menu", function(err, res) {
                    Store.commit("setmenu", res);
                });
            },
            logout: function() {
                localStorage.removeItem("logincredentials");
                Store.commit("setloggedout");
            },
            performlogin: function(credentials) {
                var self = this;
                $post("/api/login", credentials, function(err, res) {
                    if (err) {
                        Store.commit("showloginfaileddialog");
                        App.logout();
                        return;
                    }
                    Store.commit("settoken", res.token);
                    localStorage.setItem("logincredentials", JSON.stringify(credentials));
                    Store.commit("setloggedin");
                    self.loadmenu();
                });
            },
            selectmodule: function(mod) {
                Store.commit("setactivemodule", undefined); // Force reload of module when the same is clicked again
                this.$nextTick(function () {
                    Store.commit("setactivemodule", mod);
                });
            },
        }
    });

    $get("/api/settings", function(err, res) {
        Store.commit("setportalinfo", res);
    });

    var logincredentials = localStorage.getItem("logincredentials");
    if (logincredentials) App.performlogin(JSON.parse(logincredentials));

});