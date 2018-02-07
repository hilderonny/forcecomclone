var App;

window.addEventListener("load", function() {

    App = new Vue({
        el: "#App",
        data: {
            isloggedin: false,
            isportal: false,
            iswaiting: false,
            logourl: null,
            title: null,
            token: null
        },
        methods: {
            logout: function() {
                localStorage.removeItem("logincredentials");
                this.isloggedin = false;
            },
            performlogin: function(credentials) {
                this.iswaiting = true;
                var self = this;
                $post("/api/login", credentials, function(err, res) {
                    if (err) return App.logout();
                    self.token = res.token;
                    localStorage.setItem("logincredentials", JSON.stringify(credentials));
                    self.isloggedin = true;
                    self.iswaiting = false;
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