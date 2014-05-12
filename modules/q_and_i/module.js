var module;
module = (function () {
    //private
    var self;
    var path;
    var $startPage;
    //public
    return {
        init: function () {
            path = erstiapp.modules.registerModule("qi", this, {
                search: true
            });
            erstiapp.menu.add(
                "qi", {
                    name: "Fragen & Antworten",
                    $page: "#qi_start",
                    icon: "",
                    panel: true
                }
            );
            erstiapp.modules.loadPage('modules/' + path + '/start.html', function ($page) {
                $startPage = $page;
                erstiapp.modules.finishedLoading("module1");
            });
        }
    }
})
().init();