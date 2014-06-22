var module;
module = (function() {
    //private
    var self;
    var path;
    var $startPage;
    //public
    return {
        init: function() {
            path = erstiapp.modules.registerModule("lageplan", this);
            erstiapp.menu.add(
                    "lageplan", {
                        name: "Lageplan",
                        $page: "#karte",
                        icon: "",
                        panel: true
                    }
            );
            erstiapp.modules.loadPage('modules/' + path + '/karte.html', function($page) {
                $startPage = $page;
                erstiapp.modules.finishedLoading("lageplan");
                $startPage.on('pagebeforeshow', function(event) {
                    $('#mapFrame').height($(window).height() - 130);
                })
            });
        }
    }
})
        ().init();