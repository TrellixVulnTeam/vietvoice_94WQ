var connect = require('./db');
var ObjectId = require('mongodb').ObjectID;

module.exports = function(val, callback){
    connect(function(db){
        var audio = db.collection("audio");
		audio.find(val).toArray(function(err, docs){
			if(err){throw err;}
			if(docs.length === 0){
				callback([]);
			} else {
				var randomIndex = Math.floor(Math.random() * docs.length);
				callback(docs[randomIndex]);
			}			
			db.close();
		});
    });
}