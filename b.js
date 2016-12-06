var gcloud = require('google-cloud');
var speech = gcloud.speech;
var request = require('superagent');
var fs = require('fs');
var ObjectId = require('mongodb').ObjectId;

//model
var dataFile = require(process.argv[2]);
var batch = require('./model/batch');

var time = 0;
var foo = setInterval(function(){
    time++;
}, 1000);

batch(dataFile, process.argv[3]).then(function(result){
    clearInterval(time);
    console.log(result);
    console.log(`Translate ${result.length} files in ${time} seconds. Average speed: ${time / result.length} seconds/file`);
    process.exit();
});