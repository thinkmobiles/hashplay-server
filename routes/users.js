var express = require('express');
var router = express.Router();
var UsersHandler = require('../handlers/users');
var Session = require('../handlers/sessions');

module.exports = function (PostGre, app) {
    var session = new Session(PostGre);
    var usersHandler = new UsersHandler(PostGre, app);

 /*   router.get('/test', function (req, res, next) {
        res.status(200).send('Test OK');
    });

    router.post('/signUp', usersHandler.signUp);
    router.post('/signIn', usersHandler.signIn);
    router.post('/forgotPass', usersHandler.forgotPassword);
    router.post('/signInViaFB', usersHandler.signInViaFB);
    //router.post('/image', usersHandler.createUsersImage);

    router.get('/signOut', usersHandler.signOut);
    router.get('/count', session.isAdmin, usersHandler.getUsersCount);
    router.get('/confirm', usersHandler.confirmEmail);
    router.get('/:id', session.checkAccessRights , usersHandler.getUserById);
    router.get('/', session.isAdmin, usersHandler.getUsers);

    //router.put('/image', usersHandler.updateUsersImage);
    router.put('/:id', session.checkAccessRights, usersHandler.updateUser);
    router.patch('/:id', session.checkAccessRights, usersHandler.updateUser);

    router.delete('/image/:id', session.checkAccessRights, usersHandler.deleteUsersImage);
    router.delete('/:id', session.checkAccessRights, usersHandler.deleteUser);*/

    return router;
};