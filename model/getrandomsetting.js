var connect = require('./db');
var ObjectId = require('mongodb').ObjectID;

module.exports = function(callback){
    connect(function(db){
        var foo = db.collection("setting");
        foo.find({"settingName": "random"}).toArray(function(err, docs){
            if(err){throw err;}
            var data = {
                check0: docs[0].check0,
                check1: docs[0].check1,
                check2: docs[0].check2,
                check3: docs[0].check3,
                check4: docs[0].check4
            };
            callback(data);
            db.close();
        });
    });
}