var App;

window.addEventListener("load", function() {

    App = new Vue({
        el: "#App",
        data: {
            isloggedin: false,
            isportal: false,
            iswaiting: false,
            logourl: null,
            showloginwarning: false,
            title: null,
            token: null,
        },
        computed: {
            isblocked: function() { return this.showloginwarning; }
        },
        methods: {
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
            loadmenu: function() {
                var self = this;
                $get("/api/menu", function(err, res) {
                    console.log(res);
                    self.isportal = res.isportal;
                });
            }
        }
    });

    $get("/api/settings", function(err, res) {
        App.logourl = res.portallogo;
        App.title = res.portalname;
    });

    var logincredentials = localStorage.getItem("logincredentials");
    if (logincredentials) App.performlogin(JSON.parse(logincredentials));

});