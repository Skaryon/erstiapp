var module;
module = (function() {
    //private
    var self;
    var path;
    var $startPage;
    var $questionPage;
    var $answerPage;
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
            erstiapp.menu.add(
                    "qi_answer", {
                        name: "Antwort",
                        $page: "#qi_answer",
                        icon: "",
                        panel: true,
                        hide: true
                    }
            );
            erstiapp.modules.loadPage('modules/' + path + '/answer.html', function($page) {
                $answerPage = $page;
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
                                        $.ajax({
                                            type: 'GET',
                                            async: true,
                                            dataType: "json",
                                            url: erstiapp.getServer() + "getUserName?id=" + data.user,
                                            complete: function(responseData, textStatus, jqXHR) {
                                                if (textStatus != "error") {
                                                    var u = JSON.parse(responseData['responseText']);
                                                    $questionPage.find("#questionText").html('<p><b>' + u.name + ' schrieb:</b></p>' + data.text);
                                                }
                                            },
                                            error: function(responseData, textStatus, errorThrown) {
                                            }
                                        });
                                        function getAnswers() {

                                            $.ajax({
                                                type: 'GET',
                                                async: true,
                                                dataType: "json",
                                                url: erstiapp.getServer() + "getAnswers?qID=" + erstiapp.getParams().id,
                                                complete: function(responseData, textStatus, jqXHR) {
                                                    if (textStatus != "error") {
                                                        var data = JSON.parse(responseData['responseText']);
                                                        $('#ansers').html("");
                                                        if (data.result)
                                                            for (var i = 0; i < data.answers.length; i++) {
                                                                var answer = data.answers[i];
                                                                $.ajax({
                                                                    type: 'GET',
                                                                    async: false,
                                                                    dataType: "json",
                                                                    url: erstiapp.getServer() + "getUserName?id=" + answer.user,
                                                                    complete: function(responseData, textStatus, jqXHR) {
                                                                        if (textStatus != "error") {
                                                                            var data = JSON.parse(responseData['responseText']);
                                                                            var $answerDiv = $('<div class="answerText"><p><b>' + data.name + ' schrieb:</b></p>' + answer.text + '</div>').appendTo("#answers");
                                                                            if (answer.user === erstiapp.login.getUserId()) {
                                                                                var favButton = $('<a class="ui-btn ui-icon-heart ui-btn-icon-left">Top-Antwort</a>');
                                                                                $answerDiv.append('<p style="text-align:center"></p>').append(favButton);
                                                                                favButton.click(function() {
                                                                                    $.ajax({
                                                                                        type: 'GET',
                                                                                        async: false,
                                                                                        dataType: "json",
                                                                                        url: erstiapp.getServer() + "favAnswer?aID=" + answer._id + "&uID=" + answer.user + "&qID=" + erstiapp.getParams().id + "&uID=" + erstiapp.login.getUserId() + "&uPass=" + erstiapp.login.getUserPass(),
                                                                                        complete: function(responseData, textStatus, jqXHR) {
                                                                                            if (textStatus != "error") {
                                                                                                var data = JSON.parse(responseData['responseText']);
                                                                                                var $answerDiv = $('<div class="answerText"><p><b>' + data.name + ' schrieb:</b></p>' + answer.text + '</div>').appendTo("#answers");
                                                                                                if (answer.user === erstiapp.login.getUserId()) {
                                                                                                    var favButton = $('<a class="ui-btn ui-icon-heart ui-btn-icon-left">Top-Antwort</a>');
                                                                                                    $answerDiv.append('<p style="text-align:center"></p>').append(favButton);
                                                                                                    favButton.click(function() {

                                                                                                    });
                                                                                                }
                                                                                            }
                                                                                        },
                                                                                        error: function(responseData, textStatus, errorThrown) {
                                                                                        }
                                                                                    });
                                                                                });
                                                                            }
                                                                        }
                                                                    },
                                                                    error: function(responseData, textStatus, errorThrown) {
                                                                    }
                                                                });
                                                            }
                                                        else
                                                            $('#answers').html("<i>Es wurden noch keine Antworten gegeben.</i>");
                                                    }
                                                },
                                                error: function(responseData, textStatus, errorThrown) {
                                                }
                                            });
                                        }
                                        getAnswers();
                                    }
                                },
                                error: function(responseData, textStatus, errorThrown) {
                                }
                            });
                        });
                        $answerPage.on("pagebeforeshow", function(event) {
                            $.ajax({
                                type: 'GET',
                                async: true,
                                dataType: "json",
                                url: erstiapp.getServer() + "getQuestion?id=" + erstiapp.getParams().id,
                                complete: function(responseData, textStatus, jqXHR) {
                                    if (textStatus != "error") {
                                        var data = JSON.parse(responseData['responseText']);
                                        $answerPage.find("#questionText").html(data.text);
                                    }
                                },
                                error: function(responseData, textStatus, errorThrown) {
                                }
                            });
                            $('#answerButton').click(function() {
                                $.ajax({
                                    type: 'GET',
                                    async: true,
                                    dataType: "json",
                                    url: erstiapp.getServer() + "addAnswer?question=" + $('#qi_answer #answer').val() + "&uID=" + erstiapp.login.getUserId() + "&uPass=" + erstiapp.login.getUserPass() + "&qID=" + erstiapp.getParams().id,
                                    complete: function(responseData, textStatus, jqXHR) {
                                        if (textStatus != "error") {
                                            var data = JSON.parse(responseData['responseText']);
                                            console.log(data.result);
                                            erstiapp.exception(data.error, "#" + $answerPage.attr("id"));
                                            if (data.result) {
                                                erstiapp.changePage("#qi_question");
                                            }
                                        }
                                    },
                                    error: function(responseData, textStatus, errorThrown) {
                                    }
                                });
                            });
                        });
                        erstiapp.modules.finishedLoading("module1");
                    });
                });
            });
        }
    }
})
        ().init();