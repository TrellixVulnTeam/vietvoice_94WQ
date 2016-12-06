var connect = require('./db');
var ObjectId = require('mongodb').ObjectID;

module.exports = function(val, callback){
	console.log(val);
	var inc = val.checkedIncrease === 'true' ? 1 : 0;
	console.log(inc);
    connect(function(db){
        var audio = db.collection("audio");
        audio.findOne({
		    driveID: val.driveID
		}).then(function(doc){
		    var textFixArr = doc.textFix;
		    textFixArr.push(val.text);
		    audio.update({
    		    driveID: val.driveID
    		}, {
    		    $set: {
    		        text: val.text,
    		        textFix: textFixArr
    		    },
    		    $inc: { checked: inc }
    		},function(err, record){
    			if(err){throw err;}
    			callback(record);		
    			db.close();
    		});
		});
		
    });
}