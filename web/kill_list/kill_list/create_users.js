var MongoClient = require('mongodb').MongoClient;
var ObjectId    = require('mongodb').ObjectID;
var assert      = require('assert');
var config      = require('./config');

var url = config.mongodb.url;

var users_list = [
    {
        "email": "boogy@insomni.hack",
        "password": "$2a$10$4j.Cvi6MR1LDhRpaEyt/Uui8jUIFbAExGGEhOMJvNODPIfmndDzni",
    },
    {
        "email": "fakeuser@gmail.com",
        "password": "$2a$10$iUR02uUC1li75.Fdh/Z6z.CoWzDan4.3CoUOq826ZrPwmL9rKrJlu",
    }
]

var humans_list = [
    {
        "firstname"    : "John",
        "lastname"     : "Connor",
        "username"     : "@JohnConnor",
        "affiliations" : "Resistance",
        "alive"        : true,
    },
    {
        "firstname"    : "Sarah",
        "lastname"     : "Connor",
        "username"     : "@SarahConnor",
        "affiliations" : "Resistance",
        "alive"        : true,
    },
    {
        "firstname"    : "Katherine 'Kate'",
        "lastname"     : "Connor",
        "username"     : "@KateConnor",
        "affiliations" : "Resistance",
        "alive"        : true
    },
    {
        "firstname"    : "T-800",
        "lastname"     : "Protector",
        "username"     : "@T-800-Protector",
        "affiliations" : "Resistance",
        "alive"        : true
    },
    {
        "firstname"    : "T-850",
        "lastname"     : "Protector",
        "username"     : "@T-850-Protector",
        "affiliations" : "Resistance",
        "alive"        : true
    },
    {
        "firstname"    : "Jacob",
        "lastname"     : "Thornton",
        "username"     : "@fat",
        "affiliations" : "Resistance",
        "alive"        : true
    },
    {
        "firstname"    : "Larry",
        "lastname"     : "the Bird",
        "username"     : "@twitter",
        "affiliations" : "Resistance",
        "alive"        : true
    },
    {
        "firstname"    : "Abbo",
        "lastname"     : "Noakes",
        "username"     : "@thing",
        "affiliations" : "Resistance",
        "alive"        : true
    },
    {
        "firstname"    : "Naoise",
        "lastname"     : "Fane",
        "username"     : "@Fane",
        "affiliations" : "Resistance",
        "alive"        : true
    },
    {
        "firstname"    : "Darshan",
        "lastname"     : "Wasi",
        "username"     : "@WasiDarshan",
        "affiliations" : "Resistance",
        "alive"        : true
    },
    {
        "firstname"    : "Naomhan",
        "lastname"     : "Medrod",
        "username"     : "@M3dr0d",
        "affiliations" : "Resistance",
        "alive"        : true
    },
    {
        "firstname"    : "Aliaksandr",
        "lastname"     : "Otieno",
        "username"     : "@O713n0",
        "affiliations" : "Resistance",
        "alive"        : true
    },
    {
        "firstname"    : "Arcangelo",
        "lastname"     : "Carlito",
        "username"     : "@Carlito",
        "affiliations" : "Resistance",
        "alive"        : true
    },
    {
        "firstname"    : "Audoneus",
        "lastname"     : "Peer",
        "username"     : "@P33r",
        "affiliations" : "Resistance",
        "alive"        : true
    },
    {
        "firstname"    : "A.Ansigar",
        "lastname"     : "Khasan",
        "username"     : "@Ansigar",
        "affiliations" : "Resistance",
        "alive"        : true
    },
    {
        "firstname"    : "Kefilwe",
        "lastname"     : "Severiano",
        "username"     : "@Sriano",
        "affiliations" : "Resistance",
        "alive"        : true
    },
    {
        "firstname"    : "Iepthae",
        "lastname"     : "Miguel",
        "username"     : "@Miguel",
        "affiliations" : "Resistance",
        "alive"        : true
    },
    {
        "firstname"    : "A. Blago",
        "lastname"     : "Miguel",
        "username"     : "@BMiguel",
        "affiliations" : "Resistance",
        "alive"        : true
    },
    {
        "firstname"    : "K. Ansi",
        "lastname"     : "Khasani",
        "username"     : "@AKAnsi",
        "affiliations" : "Resistance",
        "alive"        : true
    },
    {
        "firstname"    : "Z. Boby",
        "lastname"     : "Blood",
        "username"     : "@ZB",
        "affiliations" : "Resistance",
        "alive"        : true
    },
    {
        "firstname"    : "Christian",
        "lastname"     : "Blaine",
        "username"     : "@chbl",
        "affiliations" : "Resistance",
        "alive"        : true
    },
    {
        "firstname"    : "Bell",
        "lastname"     : "Parmelee",
        "username"     : "@bparm",
        "affiliations" : "Resistance",
        "alive"        : true
    },
    {
        "firstname"    : "Zada",
        "lastname"     : "Vieria",
        "username"     : "@Vieriaz",
        "affiliations" : "Resistance",
        "alive"        : true
    },
    {
        "firstname"    : "A. Anderson",
        "lastname"     : "Glyn",
        "username"     : "@G1ynA",
        "affiliations" : "Resistance",
        "alive"        : true
    },
    {
        "firstname"    : "Some other human",
        "lastname"     : "Thomas N.",
        "username"     : "@TN",
        "affiliations" : "Resistance",
        "alive"        : false,
    },
    {
        "firstname"    : "Unguessable first name of the chosen one with a cool flag...",
        "lastname"     : "A. Anderson Thomas",
        "username"     : "@NEO",
        "affiliations" : "INS{w4k3_up_n30...7h3_m47r1x_h45_y0u...f0ll0w_7h3_wh173_r4bb17...kn0ck_kn0ck_n30}",
        "alive"        : false,
    }
]

MongoClient.connect(url, function(err, db) {
    var users  = db.collection('users');
    var humans = db.collection('humans');

    users.deleteMany({}, function(err, results){
        if (err){
            console.log("Error removing collection users");
        } else {
            humans.deleteMany({}, function(err, results){
                if (err){
                    console.log("Error removing humans collection");
                } else {
                    humans.insertMany(humans_list, function(err, humans) {
                        assert.equal(null, err);
                        assert.equal(humans_list.length, humans.insertedCount);
                        db.close();
                    });
                    users.insertMany(users_list, function(err, users) {
                        assert.equal(null, err);
                        assert.equal(users_list.length, users.insertedCount);
                        db.close();
                    });
                }
            });
        }
    });
});

