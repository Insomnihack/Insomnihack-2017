var express  = require('express');
var router   = express.Router();
var util     = require('util');
var bcrypt   = require('bcrypt');

var config   = require('../config');
var mycrypto = require('./mycrypto');
var Humans   = require('./models').Humans;
var Users    = require('./models').Users;

var MongoClient = require('mongodb').MongoClient;
var ObjectId    = require('mongodb').ObjectID;

var url = config.mongodb.url;

//
// Main routing
//

router.get('/', function(req, res){
    res.render('index', {
        success: req.session.success,
        errors: req.session.errors,
        isLoggedin: req.session.isLoggedin,
        username: req.session.username
    });
    req.session.errors = false;
    req.session.success = false;
});


router.get("/contact", function(req, res){
    res.render('contact', {
        success: req.session.success,
        errors: req.session.errors,
        isLoggedin: req.session.isLoggedin,
        username: req.session.username
    });
    req.session.errors = false;
    req.session.success = false;
});


router.post("/contact", function(req, res){
    req.check('email', 'Invalid email address').isEmail();

    req.getValidationResult().then(function(result){
        if(!result.isEmpty()){
            req.session.errors = result.array();
            req.session.success = false;
        } else {
            req.session.success = [{
                param: 'contact',
                msg: 'Your message will be inspected by T-800',
                value: req.body.subject
            }];
        }
        res.redirect("/contact");
    });
    req.session.errors = false;
    req.session.success = false;
});


router.get("/humans", function(req, res){
    Humans.find({alive: true}, function(err, users){
        if (err){
            console.log("Error querying humans collection");
        } else {
            req.session.humans = users;
        }
    });
    res.render('humans', {
        success: req.session.success,
        errors: req.session.errors,
        isLoggedin: req.session.isLoggedin,
        username: req.session.username,
        humans: req.session.humans
    });
    req.session.errors = false;
    req.session.success = false;
});


router.post("/humans", function(req, res){
    var query = {
        firstname: req.body.firstname,
    }
    console.log(query);

    MongoClient.connect(url, function(err, db) {
        var humans = db.collection('humans');
        humans.findOne(query, function(err, users) {
            if (err) {
                console.log("error from query: " );
                console.log(err);
            }
            console.log("DB result: ");
            console.log(users);

            if (users) {
                req.session.humans = new Array(users);
                db.close();
            } else {
                req.session.humans = null;
            }
            res.redirect('/humans');
        });
    });
});


router.get("/login", function(req, res){
    res.render("login", {
        success: req.session.success,
        errors: req.session.errors,
        isLoggedin: req.session.isLoggedin,
        username: req.session.username
    });
    req.session.errors = false;
    req.session.success = false;
});

//
// boogy@google.com
//
router.post("/login", function(req, res){
    req.checkBody('email', 'Invalid email address').notEmpty().isEmail();
    req.getValidationResult().then(function(result){
        if(!result.isEmpty()){
            req.session.errors = result.array();
            req.session.success = false;
            res.redirect('/login');
        } else {
            Users.findOne({email: req.body.email}, function(err, user){
                if (err){
                    console.log(err);
                    return;
                }
                if (user) {
                    mycrypto.comparePassword(req.body.password, user.password, function(isPasswordMatch){
                        if (isPasswordMatch){
                            req.session.isLoggedin = true;
                            req.session.username = user.email;
                            console.log("[+] Authentication success for user: " + user.email);
                        } else {
                            req.session.errors = [{param: 'email', msg: 'Wrong user name and password', value: req.body.email}];
                            req.session.success = false;
                            console.log("[-] Authentication failed for user: " + user.email);
                        }
                        res.redirect('/login');
                    });
                } else {
                    console.log("[-] No user found in the databse with email: " + user.email);
                    req.session.errors = [{param: 'email', msg: 'Nop nothing here with that name', value: req.body.email}];
                    req.session.success = false;
                    res.redirect('/login');
                }
            });
        }
    });
});


router.get('/register', function(req, res) {
    res.render("register", {
        success: req.session.success,
        errors: req.session.errors,
        isLoggedin: req.session.isLoggedin,
        username: req.session.username
    });
    req.session.errors = false;
    req.session.success = false;
});


//
// manage registration of users
//
router.post('/register', function(req, res) {
    req.checkBody('email', 'Invalid email address').notEmpty().isEmail();
    req.checkBody('password', 'Password is invalid').isLength({min: 4}).equals(req.body.confirmPassword);

    req.getValidationResult().then(function(result) {
        if (!result.isEmpty()) {
            req.session.errors = result.array();
            req.session.success = false;
            console.log(req.session.errors);
            res.redirect('/register');
        } else {
            // search database for user with specified email
            Users.findOne({email: req.body.email}, function(err, user) {
                if (err) {
                    console.log(err);
                }
                if (user) {
                    console.log("User exists!");
                    req.session.errors = [{param: 'email', msg: 'User already exists !', value: req.body.email}];
                    req.session.success = false;
                } else {
                    req.session.success = true;
                    req.session.errors = false;

                    // encrypt password and store in database
                    mycrypto.cryptPassword(req.body.password, function(err, hash) {
                        if (err) {
                            console.log(err);
                        }
                        var user = new Users({
                            email: req.body.email,
                            password: hash,
                            isadmin: false
                        });
                        user.save(function(err) {
                            if (err) {
                                if (err.name === 'MongoError' && err.code === 11000) {
                                    // Duplicate username
                                    req.session.errors = {msg: "User already exists!"}
                                    return;
                                    // return res.send({ succes: false, errors: 'User already exist!' });
                                }
                            }
                            console.log("User saved to the databse");
                            console.log("email   : " + req.body.email);
                            console.log("password: " + hash);
                        });
                    });
                }
                res.redirect('/register');
            });
        }
    });
    req.session.errors = false;
    req.session.success = false;
});


router.get('/logout',function(req,res){
    req.session.isLoggedin = false;
    req.session.username = null;
    req.session.destroy(function(err) {
        if(err){
            console.log(err);
        } else {
            res.redirect('/');
        }
    });

    req.session.errors = false;
    req.session.success = false;
});

module.exports = router;
