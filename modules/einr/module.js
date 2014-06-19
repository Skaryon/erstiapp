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
                "einr", {
                    name: "Einrichtungen",
                    $page: "#einr",
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
})().init();