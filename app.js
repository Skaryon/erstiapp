var erstiapp = (function() {
    //public
    var self = this;
    //private
    return {
       init: function() {
           $("#start").on("pageshow", function(event) {
               $('#start .openpanel').click(function() {
                   $('#mypanel').panel("open");
               });
           });
       }
    }
})().init();