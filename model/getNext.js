var connect = require('./db');
var ObjectId = require('mongodb').ObjectID;

module.exports = function(val, callback){
    console.log(val);
    connect(function(db){
        var audio = db.collection("audio");
        function dummy0(num){
            var char = "";
            for (var i=0; i<num;i++){
                char +="0";
            }
            return char;
        }
        function findNext(filenameNumber) {
            if(Number(filenameNumber) >= Number(val) + 100){
                db.close();
                return callback([]);
            }
            var nextNumber = (Number(filenameNumber) + 1).toString();
            var name = dummy0(filenameNumber.length - nextNumber.length) + nextNumber + ".wav";
            console.log(name);
            audio.find({"name": name}).toArray(function(err, docs){
    			if(err){throw err;}
    			if(docs.length === 0){
    				findNext(dummy0(filenameNumber.length - nextNumber.length) + nextNumber);
    			} else {
    			    db.close();
    				callback(docs[0]);
    			}
    		});
        }
        findNext(val);
    });
}