var CryptoPass = function () {
    var crypto = require('crypto');

    function getEncryptedPass(pass) {
        var shaSum = crypto.createHash('sha256');
        shaSum.update(pass);
        return shaSum.digest('hex');
    }

    return {
        getEncryptedPass: getEncryptedPass
    }
};

module.exports = CryptoPass;
