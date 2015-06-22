// JavaScript source code
var randomPass = function (PostGre){
    //var uuid = require('node-uuid')();
    this.generate = function(passLength) {
        var useTime = false;
        if (!passLength) {
            useTime = true;
            passLength = 50;
        }
        var now = (new Date()).valueOf();
        var alfabetical = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890' + now;
        var res = '';

        function rendomNumber(m) {
            return Math.floor((Math.random() * m));
        }

        var doit = true;
        var i = 0;
        while (doit) {
            res += alfabetical.substr(rendomNumber(alfabetical.length), 1);
            if (i === passLength) {
                doit = false;
            }
            i++;
        }
        if (!doit) {
            if (useTime) {
                return (res + now);
            }
            return res;
        }
    };

    this.generateUuid = function() {
        //var uuidLocal = uuid;
        //return uuidLocal;
    };

    this.getTicksKey = function() {
        return new Date().getTime();
    }


};

module.exports = randomPass;