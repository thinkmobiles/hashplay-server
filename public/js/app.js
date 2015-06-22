/**
 * Created by eriy on 08.05.2015.
 */

define([
    'router',
    'communication',
    'custom'
], function (Router, Communication, Custom) {

    // start application
    var initialize = function () {
        var appRouter;

        App.authorized = false;

        appRouter = new Router();
        App.router = appRouter;

        Backbone.history.start({silent: true});

       /* Communication.checkLogin(function(err, data){
            Custom.runApplication(err, data);
        });*/

    };
    return {
        initialize: initialize
    }
});