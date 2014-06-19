var module;
module = (function() {
    //private
    var self;
    var path;
    var $mensaPage;
    //public
    return {
        init: function() {
            path = erstiapp.modules.registerModule("mensa", this);
            erstiapp.menu.add(
                    "mensa", {
                        name: "Heute in der Mensa",
                        $page: "#mensa",
                        icon: "",
                        panel: true
                    }
            );
            erstiapp.modules.loadPage('modules/' + path + '/mensa.html', function($page) {
                $mensaPage = $page;
                erstiapp.modules.finishedLoading("mensa");
            });
        }
    }
})().init();