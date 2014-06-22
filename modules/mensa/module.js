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
                $mensaPage.on("pagebeforeshow", function(event) {
                    $.ajax({
                        type: 'GET',
                        async: false,
                        dataType: "html",
                        url: erstiapp.getServer() + "getMensa",
                        complete: function(responseData, textStatus, jqXHR) {
                            if (textStatus != "error") {
                                $mensaPage.find("div[data-role='content']").html(responseData['responseText']);
                            }
                        },
                        error: function(responseData, textStatus, errorThrown) {
                        }
                    });
                });
                erstiapp.modules.finishedLoading("mensa");
            });
        }
    }
})().init();