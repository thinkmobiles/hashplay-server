var RESPONSES = require('../constants/responseMessages');
var TABLES = require('../constants/tables');
var _ = require('../node_modules/underscore');
var async = require('../node_modules/async');
var Synchronize;

Synchronize = function (PostGre) {

    var SyncModel = PostGre.Models[TABLES.SYNCHRONIZES];

    this.addToSyncTable = function (options, callback) {
        var error;
        var saveObject = {
            cid: 'server',
            sync_object: {},
            updated_at: new Date()
        };

        if (options.jobType && options.uid) {
            saveObject.sync_object[options.type] = {};
            if (options.uid instanceof Array && options.uid.length > 0) {
                saveObject.sync_object[options.type][options.jobType] = [options.uid];
            } else {
                saveObject.sync_object[options.type][options.jobType] = options.uid;
            }

            SyncModel
                .forge()
                .save(saveObject)
                .exec(callback)
        } else {
            error = {
                status: 400,
                error: RESPONSES.INVALID_PARAMETERS
            };
            callback(error);
        }


    };



};

module.exports = Synchronize;