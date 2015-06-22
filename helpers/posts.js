var RESPONSES = require('../constants/responseMessages');
var TABLES = require('../constants/tables');
var MODELS = require('../constants/models');
var _ = require('../node_modules/underscore');
var Validation = require('../helpers/validation');
var Posts;
var gm = require('googlemaps');


Posts = function (PostGre) {
    var self = this;
    var PostsModel = PostGre.Models[MODELS.POST];

    this.checkCreatePostOptions = new Validation.Check({
        body: ['required'],
        author_id: ['required'],
        title: ['required'],
        lon: ['required'],
        lat: ['required'],
        type: ['isArray'],
        city_id: ['required'],
        country_id: ['required']
    });

    this.checkUpdatePostOptions = new Validation.Check({
        body: ['required'],
        //author_id: ['required'],
        title: ['required'],
        lon: ['required'],
        lat: ['required'],
        type: ['isArray'],
        city_id: ['required'],
        country_id: ['required']
    });

    this.getCountryCity = function (location, callback) {

        if (location.lat && location.lon) {
            var lngStr = location.lon + ',' + location.lat;
            gm.reverseGeocode(lngStr, function (err, data) {
                if (!err) {
                    var countryCode;
                    var countryName;
                    var city;
                    data.results[0].address_components.forEach(function (item) {
                        if (item.types[0] == 'country') {
                            countryCode = item.short_name;
                            countryName = item.long_name;
                        } else if (item.types[0] == 'locality') {
                            city = item.long_name;
                        }
                    });
                    callback(null, {
                        'city': city,
                        'country': {
                            'code': countryCode,
                            'name': countryName
                        }
                    });
                } else {
                    callback(err);
                }
            });
        }

    };


    this.getSaveData = function (options) {
        var saveData = {};

        if (options && options.body) {
            saveData.body = options.body;
        }


        if (options && options.country) {
            saveData.countryCode = options.country.code;
            saveData.countryName = options.country.name;
            saveData.city = options.country.city;
        }

        if (options && options.title) {
            saveData.title = options.title;
        }

        if (options && options.lat && options.lon) {
            saveData.lat = options.lat;
            saveData.lon = options.lon;
        }

        if (options && options.userId) {
            saveData.author_id = options.userId;
        }

        if (options && options.cityId) {
            saveData.city_id = options.cityId;
        }

        if (options && options.countryId) {
            saveData.country_id = options.countryId;
        }

        if (options && options.type) {
            saveData.type = options.type;
        }

        return saveData
    };


    this.createPostByOptions = function (options, callback) {
        self.checkCreatePostOptions.run(options, function (err, validOptions) {
            if (err) {
                callback(err);
            } else {
                PostsModel
                    .forge()
                    .save(validOptions)
                    .exec(callback);
            }
        });
    };

    this.updatePostByOptions = function (options, callback) {
        self.checkUpdatePostOptions.run(options, function (err, validOptions) {
            if (err) {
                callback(err);
            } else {
                PostsModel
                    .forge({
                        id: options.postId
                    })
                    .save(validOptions, {
                        patch: true
                    })
                    .exec(callback);
            }
        });
    }

};

module.exports = Posts;