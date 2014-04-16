var module;
module = (function () {
    //private
    var self;
    var path;
    var $startPage;
    //public
    return {
        init: function () {
            path = erstiapp.modules.registerModule("page1", this);
            erstiapp.menu.add(
                "module1", {
                    name: "Seite1",
                    $page: "#next",
                    icon: "",
                    panel: true
                }
            );
            erstiapp.modules.loadPage('modules/' + path + '/page1.html', function ($page) {
                $startPage = $page;
                erstiapp.modules.finishedLoading("module1");
            });
        }
    }
})
().init();