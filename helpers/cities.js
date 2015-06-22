var MODELS = require('../constants/models');
var Validation = require('../helpers/validation');
var Cities;


Cities = function (PostGre) {
    var self = this;
    var CitiesModel = PostGre.Models[MODELS.CITY];
    
    this.checkCreatePostOptions = new Validation.Check({
        name: ['required']
    });

    this.createCityByOptions = function (options, callback) {
        self.checkCreatePostOptions.run(options, function (err, validOptions) {
            if (err) {
                callback(err);
            } else {
                CitiesModel
                    .forge({name: validOptions.name})
                    .fetch()
                    .then(function (cityModel) {
                        if (cityModel && cityModel.id) {
                            callback(null, cityModel);
                        } else {
                            CitiesModel
                                .forge()
                                .save(validOptions)
                                .exec(callback);
                        }
                    })
                    .otherwise(callback);
            }
        });
    };
};

module.exports = Cities;