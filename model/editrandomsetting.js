var connect = require('./db');
var ObjectId = require('mongodb').ObjectID;

module.exports = function(val, callback) {
    connect(function(db) {
        var foo = db.collection("setting");
        foo.update({"settingName": "random"},{
            $set:{
                check0: Number(val.check0),
                check1: Number(val.check1),
                check2: Number(val.check2),
                check3: Number(val.check3),
                check4: Number(val.check4)
            }
        }, function(){
           callback();
           db.close();
        });
    });
}