var connect = require('./db');
var ObjectId = require('mongodb').ObjectID;

module.exports = function(val, callback){
    connect(function(db){
        var audio = db.collection("audio");
        audio.insert(val, function(err, record){
            if(err){throw err}
            db.close();
        });         
    });
}