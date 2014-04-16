var erstiapp;
erstiapp = (function () {
    //private
    //references the app for use in callback functions
    var app;
    //public
    return {
        //inits the app
        //all jQuery Mobile events go here
        init: function () {
            app = this;
            //load modules
            //$('body').append('<script type="text/javascript" src="modules.js"></script>');
            //all pages that should show the menu panel should go in here
            $("#login").on("pagebeforeshow", function (event) {
                var $this = $(this);
                $this.find("#loginButton").unbind().click(function () {
                    app.login.setUsername($('#login #username').val());
                    app.login.setPassword($('#login #password').val());
                    app.login.check(function (success) {
                        if (success) {
                            window.location.hash = "#start";
                        } else {
                            app.exception("Falsches Passwort und/oder Benutzername!", $(this));
                        }
                    });
                });
            });
            $("#start,#next").on("pagebeforeshow", function (event) {
                app.menu.addPanel($(this));
            });
            //handle userlogin
            $('div[data-role="page"]').filter(function () {
                if ($(this).attr("id") !== "login") return this;
            }).on("pagebeforeshow", function (event) {
                app.login.check(function (success) {
                    if (!success)
                        window.location.hash = "#login";
                });
            });
        },
        //show an exception popup
        exception: function (exception, $page) {
            $('<div data-role="popup" id="popupBasic"> <p>Falscher Benutzername oder Passwort!</p></div>').appendTo($page).popup().popup("open");
        },
        //handles user login
        login: (function () {
            //private
            var username = "";
            var password = "";
            //public
            return {
                //checks if the entered credentials are valid
                check: function (callback) {
                    //dummy implementation
                    if (username !== "") {
                        callback(true);
                    } else {
                        callback(false);
                    }
                },
                setUsername: function (u) {
                    username = u;
                },
                setPassword: function (p) {
                    password = p;
                }
            }
        })(),
        menu: (function () {
            //private
            //all menu items
            var menuItems = {
                "start": {
                    name: "Start",
                    $page: "#start",
                    icon: "home"
                },
                "page1": {
                    name: "Seite1",
                    $page: "#next",
                    icon: ""
                }
            }
            //public
            return {
                //add a new menutiem
                add: function (menuItem) {
                    menuItems.push(menuItem);
                },
                //remove menuItem
                remove: function (id) {
                    delete menuItems[id];
                },
                //renders the menuItems to the panel
                render: function ($page) {
                    $.each(menuItems, function (key, value) {
                        var $menuItem = $('<input type="button" id="menuitem_' + key.replace(/ /g, '') + '" data-icon="' + value.icon + '" onclick="window.location.hash=\'' + value.$page + '\'" value="' + value.name + '" />').appendTo($('#menu')).button();
                        if (value.$page === window.location.hash)
                            $menuItem.button("disable");
                    });
                },
                //move the menuItems panel to the current page
                addPanel: function ($page) {
                    //moves the openpanel button to the $page and adds the click event
                    var $openpanel = $('#openpanel').first();
                    if (!($('#buttonDiv').length > 0)) {
                        $('<div id="buttonDiv" class="buttonDiv"></div>').prepend($openpanel).prependTo($page.find('div[data-role="header"]'));
                    }
                    $('#buttonDiv').html("").append($openpanel).remove().prependTo($page.find('div[data-role="header"]'));
                    $openpanel.unbind().click(function () {
                        var panel = $page.find('#menu');
                        if (panel.hasClass("ui-panel-open")) {
                            panel.panel("close");
                        } else {
                            panel.panel("open");
                        }
                    });
                    //moves the menuItems to the $page
                    $('#menu').remove().prependTo($page).html("");
                    //adds menuItems items to the event for the menuItems panel
                    this.render($page);
                    $page.trigger("create");
                }
            }
        })(),
        modules: (function () {
            //private
            var mods = [];
            //public
            return {
                setModules: function (m) {
                    modules = m;
                    for (var i = 0; i < m.length; i++) {
                        $('body').append(m[i].path + "/module.js");
                    }
                }
            }
        })()
    }
})().init();