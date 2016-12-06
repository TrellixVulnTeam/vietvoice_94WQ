var connect = require('./db');
var ObjectId = require('mongodb').ObjectID;

module.exports = function(callback){
    connect(function(db){
        var audio = db.collection("audio");
		audio.find({checked: 4}).toArray(function(err, docs){
		    if(err){throw err;}
		    db.close();
			callback(docs);
		});
    });
}