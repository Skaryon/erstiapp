var module;
module = (function() {
    //private
    var self;
    var path;
    var $startPage;
    var $questionPage;
    //public
    return {
        init: function() {
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
            erstiapp.menu.add(
                    "qi_question", {
                        name: "Frage",
                        $page: "#qi_question",
                        icon: "",
                        panel: true,
                        hide: true
                    }
            );
            erstiapp.modules.loadPage('modules/' + path + '/question.html', function($page) {
                $questionPage = $page;
                erstiapp.modules.loadPage('modules/' + path + '/start.html', function($page) {
                    $startPage = $page;
                    $startPage.on("pagebeforeshow", function(event) {
                        $('#questionButton').click(function() {
                            if ($("#qi_start #questionCat option:selected").val() === "0")
                                erstiapp.exception("Bitte wähle eine Kategorie aus!", "#" + $startPage.attr("id"));
                            else {
                                console.log(erstiapp.getServer() + "askQuestion?question=" + $('#qi_start #question').val() + "&category=" + $("#qi_start #questionCat option:selected").val() + "&uID=" + erstiapp.login.getUserId() + "&uPass=" + erstiapp.login.getUserPass())
                                $.ajax({
                                    type: 'GET',
                                    async: true,
                                    dataType: "json",
                                    url: erstiapp.getServer() + "askQuestion?question=" + $('#qi_start #question').val() + "&category=" + $("#qi_start #questionCat option:selected").val() + "&uID=" + erstiapp.login.getUserId() + "&uPass=" + erstiapp.login.getUserPass(),
                                    complete: function(responseData, textStatus, jqXHR) {
                                        if (textStatus != "error") {
                                            var data = JSON.parse(responseData['responseText']);
                                            console.log(data.result);
                                            erstiapp.exception(data.error, "#" + $startPage.attr("id"));
                                            if (data.result) {
                                                console.log(data.id)
                                                erstiapp.changePage("#qi_question", {}, {id: data.id});
                                            }
                                        }
                                    },
                                    error: function(responseData, textStatus, errorThrown) {
                                    }
                                });
                            }
                        });
                    });
                    $questionPage.on("pagebeforeshow", function(event) {
                        $.ajax({
                            type: 'GET',
                            async: true,
                            dataType: "json",
                            url: erstiapp.getServer() + "getQuestion?id=" + erstiapp.getParams().id,
                            complete: function(responseData, textStatus, jqXHR) {
                                if (textStatus != "error") {
                                    var data = JSON.parse(responseData['responseText']);
                                    $questionPage.find("#questionText").html(data.text);
                                }
                            },
                            error: function(responseData, textStatus, errorThrown) {
                            }
                        });
                    });
                    erstiapp.modules.finishedLoading("module1");
                });
            });
        }
    }
})
        ().init();