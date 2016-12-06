var connect = require('./db');
var ObjectId = require('mongodb').ObjectID;

module.exports = function(val, callback){
    connect(function(db){
        var audio = db.collection("audio");
		audio.findOne(val).then(function(doc){
			callback(doc);
			db.close();
		});
    });
}