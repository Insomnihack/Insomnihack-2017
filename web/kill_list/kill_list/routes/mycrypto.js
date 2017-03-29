// https://github.com/kelektiv/node.bcrypt.js#api
var bcrypt = require('bcrypt');

var saltRounds = 10;

function cryptPassword(password, callback) {
    bcrypt.genSalt(saltRounds, function(err, salt) {
        if (err) {
            return callback(err);
        }
        bcrypt.hash(password, salt, function(err, hash) {
            return callback(err, hash);
        });
    });
};

function comparePassword(myPlaintextPassword, hash, callback) {
    bcrypt.compare(myPlaintextPassword, hash, function(err, isPasswordMatch) {
        if (err) {
            return callback(err);
        }
        return callback(isPasswordMatch);
    });
};


function encrypt(password){
    cryptPassword(password, (err, hash) => {
        if (err) throw err;
        return hash;
    });
}


function checkPassword(myPlaintextPassword, hash){
    comparePassword(myPlaintextPassword, hash, (err, isPasswordMatch) => {
        if (err) throw err;
        return isPasswordMatch;
    });
}

module.exports = {
    cryptPassword  : cryptPassword,
    comparePassword: comparePassword,
    encrypt        : encrypt,
    checkPassword  : checkPassword
}