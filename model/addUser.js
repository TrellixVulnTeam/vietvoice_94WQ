var connect = require('./db');
var ObjectId = require('mongodb').ObjectID;

module.exports = function(val, callback){
    connect(function(db){
        var foo = db.collection("user");
        foo.insert(val, function(err, record){
            if(err){throw err}
            callback(record.ops[0]);
            db.close();
        });
        
    });
}