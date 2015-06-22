/**
 * Created by soundstorm on 23.03.15.
 */
var async = require('../node_modules/async');

function Check(validJSON, objectOfValidationFunctions) {
    var self = this;

    this.run = function (options, callback, settings) {
        if (settings && !!settings.withoutValidation) {
            callback(null, options);
        } else {
            var errors;
            var saveModelOptions = {};
            var result;
            var objectRule;

            for (var key in validJSON) {
                validJSON[key].forEach(function (element) {
                    if (key in options) {
                        result = self[element](options[key]);
                        if (result !== undefined) {
                            saveModelOptions[key] = result;
                        } else {
                            if (errors) {
                                errors += key + ': The validation "' + element + '" failed.\r\n';
                            } else {
                                errors = key + ': The validation "' + element + '" failed.\r\n';
                            }
                        }
                    } else if (element === 'required') {
                        if (errors) {
                            errors += key + ': The validation "' + element + '" failed.\r\n';
                        } else {
                            errors = key + ': The validation "' + element + '" failed.\r\n';
                        }
                    }
                })
            }

            if (!errors && !Object.keys(saveModelOptions).length) {
                errors = 'Save object is empty, wrong name of fields';
            }

            if (!errors) {
                if (settings) {
                    if (settings.checkFunctions && settings.checkFunctions.length) {
                        async.each(settings.checkFunctions,function(checkFunctionName, callback) {
                            //TODO check if is a function objectOfValidationFunctions[checkFunctionName]
                            if (objectOfValidationFunctions[checkFunctionName]) {
                                objectOfValidationFunctions[checkFunctionName](options, saveModelOptions, callback);
                            } else {
                                callback();
                            }
                        }, function(errors, response) {
                            if (errors) {
                                callback(errors);
                            } else {
                                callback(null, saveModelOptions);
                            }
                        });
                    } else {
                        callback();
                    }
                } else {
                    callback(null, saveModelOptions);
                }
            } else {
                callback(errors);
            }
        }
    };
}

Check.prototype = {
    required: function (val) {
        if (val === undefined && val !== null) {
        } else {
            return val;
        };
    },
    isEmail: function (val) {
        var regexp = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (regexp.test(val)) {
            return val;
        }
    },
    isInt: function (val) {
        if (val && !isNaN(+val)) {
            if (val === null) {
                return null;
            } else {
                return parseInt(val);
            };
        };
    },
    isFloat: function (val) {
        if (!isNaN(+val)) {
            return parseFloat(val);
        };
    },
    isArray: function (val) {
        if (Array.isArray(val)) {
            return val;
        };
    },
    isDate: function (val) {
        if (val instanceof Date) {
            if (!isNaN(val.valueOf())) {
                return val;
            }
        } else {
            var date = new Date(val);
            if (!isNaN(date.valueOf())) {
                return date;
            }
        }
    },
    isBoolean: function (val) {
        if (typeof(val) === 'boolean') {
            return val;
        } else if (val === 'true' || val === 'false') {
            return Boolean(val);
        };
    },
    isString: function (val) {
        if (typeof(val) === 'string' || typeof(val) === 'number') {
            return val + '';
        };
    },
    isTime: function (val) {
        var regexp = /^(?:2[0-3]|[01]?[0-9]):[0-5][0-9]:[0-5][0-9]$/;
        if (regexp.test(val)) {
            return val;
        };
    },
    isNotNull: function (val) {
        if (val !== 'null' && val !== null) {
            return val
        }
    },
    isNotEmptyString: function (val) {
        if (typeof val === 'string' && val !== '') {
            return val
        }
    }
};

module.exports.Check = Check;