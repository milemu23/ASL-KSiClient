var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

//connect to database
mongoose.connect('mongodb://ks-db:KeyLime23@ds023475.mlab.com:23475/ks-db');

var db = mongoose.connection;

//User Schema
var UserSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        index: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String
    },
    name: {
        type: String
    }
});

//allow to use outside
var User =  mongoose.model('users', UserSchema);
module.exports = User;

//outside module
module.exports.getUserById = function(id, callback){
    User.findById(id, callback);
};

module.exports.getUserByUsername = function(username, callback) {
    var query = {username: username};
    //find only one user with that username
    User.findOne(query, callback);
};

module.exports.comparePassword = function(candidatePassword, hash, callback) {
    //use bcrypt method - compare
    bcrypt.compare(candidatePassword, hash, function(err, isMatch){
        callback(null, isMatch);
    });
};

//function to be available outside
module.exports.createUser = function(newUser, callback) {

    //encrypt password
    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(newUser.password, salt, function(err, hash) {
            //hashes password before saving
            newUser.password = hash;
            newUser.save(callback);
        });
    });

};