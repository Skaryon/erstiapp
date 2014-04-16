var module;
module = (function () {
    //private
    var self;
    var path;
    var $startPage;
    //public
    return {
        init: function () {
            path = erstiapp.modules.registerModule("start", this);
            erstiapp.menu.add(
                "start", {
                    name: "Start",
                    $page: "#start",
                    icon: "home",
                    panel: true
                }
            );
            erstiapp.modules.loadPage('modules/' + path + '/start.html', function ($page) {
                $startPage = $page;
                erstiapp.modules.finishedLoading("start");
            });
        }
    }
})
().init();