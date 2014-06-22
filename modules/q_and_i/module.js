var module;
module = (function() {
    //private
    var self;
    var path;
    var $startPage;
    var $questionPage;
    var $answerPage;
    var $questionsPage;
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
                erstiapp.modules.loadPage('modules/' + path + '/questions.html', function($page) {
                    $questionsPage = $page;
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
                                            async: false,
                                            dataType: "json",
                                            url: erstiapp.getServer() + "askQuestion?question=" + $('#qi_start #question').val() + "&category=" + $("#qi_start #questionCat option:selected").val() + "&uID=" + erstiapp.login.getUserId() + "&uPass=" + erstiapp.login.getUserPass(),
                                            complete: function(responseData, textStatus, jqXHR) {
                                                if (textStatus != "error") {
                                                    var data = JSON.parse(responseData['responseText']);
                                                    console.log(data.result);
                                                    erstiapp.exception(data.error, "#" + $startPage.attr("id"));
                                                    if (data.result) {
                                                        console.log(data.id)
                                                        erstiapp.changePage("#qi_question", {}, {id: data.id, favAnswer: data.favAnswer});
                                                    }
                                                }
                                            },
                                            error: function(responseData, textStatus, errorThrown) {
                                            }
                                        });
                                    }
                                });
                            });
                            $questionsPage.on("pagebeforeshow", function(event) {
                                $('#qi_questions #questionsCat').unbind().change(function() {
                                    $('#qi_questions #questionsCat').selectmenu("refresh");
                                    $.ajax({
                                        type: 'GET',
                                        async: false,
                                        dataType: "json",
                                        url: erstiapp.getServer() + "getQuestions?category=" + $("#qi_questions #questionsCat option:selected").val(),
                                        complete: function(responseData, textStatus, jqXHR) {
                                            if (textStatus != "error") {
                                                var data = JSON.parse(responseData['responseText']);
                                                if (data.result) {
                                                    $('#qi_questions #questions').html("");
                                                    var ul = $('<ul></ul>').appendTo($('#qi_questions #questions'));
                                                    for (var i = 0; i < data.questions.length; i++) {
                                                        var question = data.questions[i];
                                                        ul.append('<li qID="' + questions._id + '"><a onclick="erstiapp.changePage(\'#qi_question\',{},{id: \'' + question._id + '\', favAnswer: \'' + question.favAnswer + '\'})">' + question.text + '</a></li>');
                                                    }
                                                    ul.listview({
                                                        create: function(event, ui) {
                                                            
                                                        }
                                                    });
                                                }
                                            }
                                        },
                                        error: function(responseData, textStatus, errorThrown) {
                                        }
                                    });
                                });
                            });
                            $questionPage.on("pagebeforeshow", function(event) {
                                $.ajax({
                                    type: 'GET',
                                    async: false,
                                    dataType: "json",
                                    url: erstiapp.getServer() + "getQuestion?id=" + erstiapp.getParams().id,
                                    complete: function(responseData, textStatus, jqXHR) {
                                        if (textStatus != "error") {
                                            var data = JSON.parse(responseData['responseText']);
                                            $questionPage.find("#questionText").html(data.text);
                                            $.ajax({
                                                type: 'GET',
                                                async: false,
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
                                                console.log(1);
                                                $.ajax({
                                                    type: 'GET',
                                                    async: false,
                                                    dataType: "json",
                                                    url: erstiapp.getServer() + "getAnswers?qID=" + erstiapp.getParams().id,
                                                    complete: function(responseData, textStatus, jqXHR) {
                                                        console.log(2);
                                                        if (textStatus != "error") {
                                                            var data = JSON.parse(responseData['responseText']);
                                                            $('#answers').html("");
                                                            if (data.result)
                                                                for (var i = 0; i < data.answers.length; i++) {
                                                                    var answer = data.answers[i];
                                                                    console.log(answer)
                                                                    var aID = JSON.parse(JSON.stringify(answer._id));
                                                                    var aUser = JSON.parse(JSON.stringify(answer.user));
                                                                    if (textStatus != "error") {
                                                                        var $answerDiv = $('<div class="answerText"><p><b>' + answer.userName + ' schrieb:</b></p>' + answer.text + '</div>');
                                                                        if (aID === erstiapp.getParams().favAnswer)
                                                                            $answerDiv.prepend('</p>Top-Antwort:</p>').addClass("favAnswer").prependTo($('#answers'));
                                                                        else {
                                                                            $answerDiv.appendTo($('#answers'));
                                                                            if (answer.user === erstiapp.login.getUserId()) {
                                                                                var favButton = $('<a id="b' + i + '" aID="' + aID + '" class="ui-btn ui-icon-heart ui-btn-icon-left">Top-Antwort</a>');
                                                                                $('<p style="text-align:center"></p>').appendTo($answerDiv).append(favButton);

                                                                                favButton.click(function() {
                                                                                    aID = $(this).attr("aID");
                                                                                    $.ajax({
                                                                                        type: 'GET',
                                                                                        async: false,
                                                                                        dataType: "json",
                                                                                        url: erstiapp.getServer() + "favAnswer?aID=" + aID + "&user=" + aUser + "&qID=" + erstiapp.getParams().id + "&uID=" + erstiapp.login.getUserId() + "&uPass=" + erstiapp.login.getUserPass(),
                                                                                        complete: function(responseData, textStatus, jqXHR) {
                                                                                            if (textStatus != "error") {
                                                                                                console.log(aID)
                                                                                                erstiapp.getParams().favAnswer = aID;
                                                                                                getAnswers();
                                                                                            }
                                                                                        },
                                                                                        error: function(responseData, textStatus, errorThrown) {
                                                                                        }
                                                                                    });
                                                                                });
                                                                            }
                                                                        }
                                                                    }
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
                                    async: false,
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
                                $('#answerButton').unbind().click(function() {
                                    console.log("click")
                                    $.ajax({
                                        type: 'GET',
                                        async: false,
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
            });
        }
    }
})
        ().init();