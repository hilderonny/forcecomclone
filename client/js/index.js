var App;

window.addEventListener("load", function() {

    App = new Vue({
        el: "#App",
        data: {
            currentModule: null,
            isloggedin: false,
            isportal: false,
            iswaiting: false,
            logourl: null,
            menu: null,
            showloginwarning: false,
            title: null,
            token: null,
            version: null
        },
        computed: {
            isblocked: function() { return this.showloginwarning; }
        },
        methods: {
            loadmenu: function() {
                var self = this;
                $get("/api/menu", function(err, res) {
                    self.menu = res;
                });
            },
            logout: function() {
                localStorage.removeItem("logincredentials");
                this.isloggedin = false;
            },
            performlogin: function(credentials) {
                var self = this;
                $post("/api/login", credentials, function(err, res) {
                    if (err) {
                        self.showloginwarning = true;
                        App.logout();
                        return;
                    }
                    self.token = res.token;
                    localStorage.setItem("logincredentials", JSON.stringify(credentials));
                    self.isloggedin = true;
                    self.loadmenu();
                });
            },
            selectmodule: function(mod) {
                this.currentModule = null; // Force reload of module when the same is clicked again
                this.$nextTick(function () {
                    this.currentModule = mod;
                });
            },
        }
    });

    $get("/api/settings", function(err, res) {
        App.logourl = res.portallogo;
        App.title = res.portalname;
        App.version = res.version;
    });

    var logincredentials = localStorage.getItem("logincredentials");
    if (logincredentials) App.performlogin(JSON.parse(logincredentials));

});