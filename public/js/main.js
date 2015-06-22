var App = {};

require.config({
    paths: {
        jQuery: './libs/jquery-2.1.0.min.map',
        Underscore: './libs/underscore-min.map.1.6.0',
        Backbone: './libs/backbone-min.map.1.1.2',
        //templates: '../templates',
        text: './libs/text'
    },
    shim: {
        'Backbone': ['Underscore', 'jQuery'],
        'app': ['Backbone']
    }
});

require(['app'], function (app) {

    app.initialize();

});
