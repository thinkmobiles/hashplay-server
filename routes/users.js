var express = require('express');
var router = express.Router();
var UsersHandler = require('../handlers/users');
var SessionsHandler = require('../handlers/sessions');

module.exports = function (db) {

   var users = new UsersHandler(db);
   var session = new SessionsHandler(db);

   //router.get('/',session.authenticatedUser, users.getUser);


    return router;
};