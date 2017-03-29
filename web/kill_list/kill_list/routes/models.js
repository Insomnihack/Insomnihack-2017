var config   = require('../config');
var mongoose = require('mongoose');

mongoose.connect(config.mongodb.url)
var Schema = mongoose.Schema;

var userSchema = new Schema({
    email:    { type: String, required: true, unique: true },
    password: { type: String, required: true, unique: false },
    isadmin : { type: Boolean, required: true, unique: false }
}, { collection: 'users'});


var humansSchema = new Schema({
    firstname:  { type: String, required: true , unique: true },
    lastname:   { type: String, required: true , unique: false},
    username:   { type: String, required: false, unique: false}
}, { collection: 'humans'});


var flagSchema = new Schema({
    firstname:  { type: String, required: true , unique: true },
    secondname: { type: String, required: true , unique: false},
    email:      { type: String, required: false, unique: false},
    pseudo:     { type: String, required: false, unique: false}
}, { collection: 'humans'});


var Users  = mongoose.model('Users', userSchema);
var Humans = mongoose.model('Humans', humansSchema);
var Flag = mongoose.model('Flag', flagSchema);

module.exports = {
    Users,
    Humans
}



// var mongoose = require('mongoose'),
//     Schema = mongoose.Schema,
//     bcrypt = require('bcrypt'),
//     SALT_WORK_FACTOR = 10;

// var UserSchema = new Schema({
//     username: { type: String, required: true, index: { unique: true } },
//     password: { type: String, required: true }
// });

// UserSchema.pre('save', function(next) {
//     var user = this;

//     // only hash the password if it has been modified (or is new)
//     if (!user.isModified('password')) return next();

//     // generate a salt
//     bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
//         if (err) return next(err);

//         // hash the password using our new salt
//         bcrypt.hash(user.password, salt, function(err, hash) {
//             if (err) return next(err);

//             // override the cleartext password with the hashed one
//             user.password = hash;
//             next();
//         });
//     });
// });

// UserSchema.methods.comparePassword = function(candidatePassword, cb) {
//     bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
//         if (err) return cb(err);
//         cb(null, isMatch);
//     });
// };

// module.exports = mongoose.model('User', UserSchema);