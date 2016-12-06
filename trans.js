var gcloud = require('google-cloud');
var speech = gcloud.speech;
var request = require('superagent');
var fs = require('fs');
var ObjectId = require('mongodb').ObjectId;

//model
var dataFile = require(process.argv[2]);
var batch = require('./model/batch');

batch(dataFile).then(function(result){
    console.log(result);
});