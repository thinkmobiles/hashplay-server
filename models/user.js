module.exports = function (db){
    'use strict';

    var mongoose = require('mongoose');
    var schema = mongoose.Schema;


    var user = new schema({
        name: String

    });

    var userModel = db.model('user', user);


};