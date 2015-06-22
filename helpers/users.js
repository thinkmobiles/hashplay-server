var RESPONSES = require('../constants/responseMessages');
var Session = require('../handlers/sessions');
var TABLES = require('../constants/tables');
var MODELS = require('../constants/models');
var CONSTANTS = require('../constants/constants');
var _ = require('../node_modules/underscore');
var async = require('../node_modules/async');
var Validation = require('../helpers/validation');
var CrypPass = require('../helpers/cryptoPass');
var ImagesHelper = require('../helpers/images');
var Users;

Users = function (PostGre) {
    var self = this;
    var UserModel = PostGre.Models[MODELS.USER];
    var imagesHelper = new ImagesHelper(PostGre);
    var cryptoPass = new CrypPass();


    this.checkFunctions = {
        checkUniqueEmail: function (options, validOptions, callback) {
            var error;

            if (validOptions.email || validOptions.change_email) {
                UserModel
                    .forge()
                    .query(function (qb) {
                        if (validOptions.email) {
                            qb.where('email', validOptions.email)
                        }

                        if (options.id && validOptions.change_email) {
                            qb.where('email', validOptions.change_email)
                        }

                        if (options.id) {
                            qb.where('id', '!=', options.id)
                        }
                    })
                    .fetch()
                    .then(function (user) {
                        if (user && user.id) {
                            error = new Error(RESPONSES.NOT_UNIQUE_EMAIL);
                            error.status = 400;

                            callback(error);
                        } else {
                            callback();
                        }
                    })
                    .otherwise(callback);
            } else {
                error = new Error(RESPONSES.INVALID_PARAMETERS);
                error.status = 400;

                callback(error)
            }
        },

        encryptPass: function (options, validOptions, callback) {
            validOptions.password = cryptoPass.getEncryptedPass(validOptions.password);
            callback();
        }
    };

    this.checkCreateUserOptions = new Validation.Check({
        first_name: ['isString'],
        last_name: ['isString'],
        password: ['required'],
        email: ['required', 'isEmail'],
        gender: ['isInt'],
        confirm_status: ['isInt'],
        confirm_token: ['isString'],
        birthday: ['isDate'],
        role: ['isInt']
    }, self.checkFunctions);

    this.checkCreateUserOptionsviaFB = new Validation.Check({
        facebook_id: ['required', 'isString'],
        first_name: ['isString'],
        last_name: ['isString'],
        email: ['isEmail'],
        gender: ['isInt'],
        birthday: ['isDate'],
        role: ['isInt']
    }, self.checkFunctions);

    this.checkUpdateUserOptions = new Validation.Check({
        first_name: ['isString'],
        last_name: ['isString'],
        change_email: ['isEmail'],
        email: ['isEmail'],
        gender: ['isInt'],
        birthday: ['isDate'],
        confirm_token: ['isString'],
        confirm_status: ['isInt'],
        role: ['isInt']
    }, self.checkFunctions);

    this.checkFBIdOrEmail = function (options, callback) {
        var resultUsersList;
        async.parallel([
            function (cb) {
                UserModel
                    .forge({
                        facebook_id: options.facebook_id
                    })
                    .fetch()
                    .then(function (user) {
                        if (user && user.id) {
                            cb(null, user)
                        } else {
                            cb()
                        }
                    })
                    .otherwise(cb)
            },
            function (cb) {
                UserModel
                    .forge({
                        email: options.email
                    })
                    .fetch()
                    .then(function (user) {
                        if (user && user.id) {
                            cb(null, user)
                        } else {
                            cb()
                        }
                    })
                    .otherwise(cb)
            },
            function (cb) {
                UserModel
                    .forge({
                        change_email: options.email
                    })
                    .fetch()
                    .then(function (user) {
                        if (user && user.id) {
                            cb(null, user)
                        } else {
                            cb()
                        }
                    })
                    .otherwise(cb)
            }
        ], function (err, result) {
            if (err) {
                callback(err)
            } else {
                resultUsersList = {
                  userByFBId: result[0],
                    userByEmail: result[1],
                    userByChangeEmail: result[2]
                };
                callback(null, options, resultUsersList)
            }
        })
    };

    this.createUserByOptions = function (options, callback, settings) {
        var imageData;
        self.checkCreateUserOptions.run(options, function (err, validOptions) {
            if (err) {
                callback(err);
            } else {
                UserModel
                    .forge()
                    .save(validOptions)
                    .then(function (user) {
                        if (options.image) {
                            imageData = {
                                image: options.image,
                                imageable_id: user.id,
                                imageable_type: options.imageType
                            };
                            imagesHelper.createImageByOptions(imageData, function (err, imageModel) {
                                if (err) {
                                    callback(err);
                                } else {
                                    callback(null, user)
                                }
                            });
                        } else {
                            callback(null, user)
                        }
                    })
                    .otherwise(callback)
            }
        }, settings);
    };

    this.updateUserByOptions = function (options, callback, settings) {
        var saveImageData;
        var deleteImageData;
        var error;

        self.checkUpdateUserOptions.run(options, function (err, validOptions) {
            if (err) {
                callback(err)
            } else {
                async.parallel([
                    function(cb) {
                        if (options.image) {
                            async.series([
                                function (cb) {
                                    deleteImageData = {
                                        imageable_id: options.id,
                                        imageable_type: TABLES.USERS
                                    };
                                    imagesHelper.deleteImageByOptions(deleteImageData, cb);
                                },
                                function (cb) {
                                    saveImageData = {
                                        image: options.image,
                                        imageable_id: options.id,
                                        imageable_type: TABLES.USERS
                                    };
                                    imagesHelper.createImageByOptions(saveImageData, cb);
                                }
                            ], cb);
                        } else {
                            cb();
                        }
                    },
                    function(cb) {
                        UserModel
                            .forge({
                                id: options.id
                            })
                            .save(validOptions, {
                                patch: true
                            })
                            .exec(cb);
                    }
                ], function(err, results) {
                    if (err) {
                        callback(err)
                    } else {
                        callback(null, results[1]);
                    }
                });
            }
        }, settings)
    };

    this.createUserByOptionsviaFB = function (options, callback, settings) {
        var error;
        var imageData = {
            image: options.image,
            imageable_type: options.imageType
        };
        self.checkCreateUserOptionsviaFB.run(options, function (err, validOptions) {
            if (err) {
                callback(err);
            } else {
                self.checkFBIdOrEmail(validOptions, function (err, validOptions, usersList) {
                    if (err) {
                        callback(err);
                    } else {
                        if (!usersList.userByFBId && !usersList.userByEmail && !usersList.userByChangeEmail) {
                            validOptions.confirm_status = CONSTANTS.CONFIRM_STATUS.CONFIRMED;
                            UserModel
                                .forge()
                                .save(validOptions)
                                .then(function (user) {
                                    if (imageData.image) {
                                        imageData.imageable_id =  user.id;
                                        imagesHelper.createImageByOptions(imageData, function (err, imageModel) {
                                            if (err) {
                                                callback(err);
                                            } else {
                                                callback(null, user, CONSTANTS.FB_ACTIONS.CREATE)
                                            }
                                        });
                                    } else {
                                        callback(null, user, CONSTANTS.FB_ACTIONS.CREATE)
                                    }
                                })
                                .otherwise(callback)

                        } else if (!!usersList.userByFBId) {
                            callback(null, usersList.userByFBId, CONSTANTS.FB_ACTIONS.SIGN_IN)
                        } else if (!usersList.userByFBId && !!usersList.userByEmail) {
                            validOptions.confirm_status = CONSTANTS.CONFIRM_STATUS.CONFIRMED;

                            usersList.userByEmail
                                .save(validOptions, {
                                    patch: true
                                })
                                .then(function (user) {
                                    callback(null, user, CONSTANTS.FB_ACTIONS.SIGN_IN)
                                })
                                .otherwise(callback)

                        } else if (!usersList.userByFBId && !usersList.userByEmail && !!usersList.userByChangeEmail) {
                            async.parallel([
                                function (cb) {
                                    usersList.userByChangeEmail
                                        .save({
                                            change_email: null,
                                            confirm_status: CONSTANTS.CONFIRM_STATUS.CONFIRMED
                                        }, {
                                            patch: true
                                        })
                                        .exec(cb)
                                },
                                function (cb) {
                                    validOptions.confirm_status = CONSTANTS.CONFIRM_STATUS.CONFIRMED;
                                    UserModel
                                        .forge()
                                        .save(validOptions)
                                        .then(function (user) {
                                            if (imageData.image) {
                                                imageData.imageable_id =  user.id;
                                                imagesHelper.createImageByOptions(imageData, function (err, imageModel) {
                                                    if (err) {
                                                        cb(err);
                                                    } else {
                                                        cb(null, user)
                                                    }
                                                });
                                            } else {
                                                cb(null, user)
                                            }
                                        })
                                        .otherwise(cb)
                                }
                            ], function (err, user) {
                                if (err) {
                                    callback(err)
                                } else {
                                    callback(null, user, CONSTANTS.FB_ACTIONS.CREATE)
                                }
                            })
                        } else {
                            error = new Error(RESPONSES.INVALID_PARAMETERS);
                            error.status = 400;
                            callback(error)
                        }
                    }
                })
            }
        }, settings);
    };

};

module.exports = Users;