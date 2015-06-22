var MODELS = require('../constants/models');

var Models = function (/*PostGre*/) {
    //"use strict";
    /*var _ = require('underscore');
    PostGre.plugin('visibility');

    var Model = PostGre.Model.extend({
        hasTimestamps: true,
        getName: function () {
            return this.tableName.replace(/s$/, '')
        }
    }, {
        fetchMe: function (queryObject, optionsObject) {
            return this.forge(queryObject).fetch(optionsObject);
        },
        insert: function (requestBody, customBody, saveOptions) {
            requestBody = _.mapObject(requestBody, function (val, key) {
                if (val === 'null') {
                    return null;
                }
                return val;
            });

            customBody = _.mapObject(customBody, function (val, key) {
                if (val === 'null') {
                    return null;
                }
                return val;
            });
            return this.forge(requestBody).save(customBody, saveOptions);
            //return this.forge().save(requestBody, saveOptions);
        }*/
  //  }
//);

   /* this[MODELS.USER] = require('./users')(PostGre, Model);
    this[MODELS.POST] = require('./posts')(PostGre, Model);
    this[MODELS.CITY] = require('./cities')(PostGre, Model);
    this[MODELS.COUNTRY] = require('./countries')(PostGre, Model);
    this[MODELS.FEEDBACK] = require('./feedbacks')(PostGre, Model);
    this[MODELS.COMPLAINT] = require('./complaints')(PostGre, Model);
    this[MODELS.IMAGE] = require('./images')(PostGre, Model);
    this[MODELS.STATIC_INFO] = require('./staticInfo')(PostGre, Model);*/
};
module.exports = Models;