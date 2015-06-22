var SessionHandler = require('./sessions');
var User = function(db) {

    var mongoose = require('mongoose');
    var session = new SessionHandler(db);
    var logWriter = require('../modules/logWriter')();
    var lodash = require('lodash');
    var async = require('async');
    var User = db.model('user');


};

module.exports = User;