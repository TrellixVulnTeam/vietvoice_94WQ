var mongo = require("mongodb").MongoClient;
var url = 'mongodb://localhost:27017/vietvoice';

module.exports = function(main){
    mongo.connect(url, function(err,db){
        if(err){throw err}
        main(db);
    });
}