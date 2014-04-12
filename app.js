var erstiapp = (function() {
    //private
    var self = this;
    var test = "hi";
    //public
    return {
       test2: "hallo",
       init: function() {
           $("#start").on("pageshow", function(event) {
               $('#start .openpanel').click(function() {
                   $('#mypanel').panel("open");
                   alert(test);
                   alert(this.test2)
               });
           });
       }
    }
})().init();