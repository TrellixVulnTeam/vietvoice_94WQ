var gcloud = require('google-cloud');
var speech = gcloud.speech;
var request = require('superagent');
var fs = require('fs');

var optionFlac = {
  encoding: 'FLAC',
  sampleRate: 16000,
  languageCode: "vi-VN"
};

var optionRaw = {
  encoding: 'LINEAR16',
  sampleRate: 16000,
  languageCode: "vi-VN"
}

var optionAudio = process.argv[2] === "flac" ? optionFlac : optionRaw;

var speechClient = speech({
  projectId: 'vietvoice-144807',
  keyFilename: 'Vietvoice-9bf9e4706430.json'
});


// Detect the speech in an audio file stream. 
if(process.argv[3].indexOf("http") === -1 && process.argv[3].indexOf("id=") === -1){
	var chunk = '';
	fs.createReadStream('./'+process.argv[3])
	  .on('error', console.error)
	  .pipe(speechClient.createRecognizeStream({
		config: optionAudio,
		singleUtterance: false,
		interimResults: false
	  }))
	  .on('error', console.error)
	  .on('data', function(data) {
		
		chunk= chunk + data.results;
		chunk = chunk.replace(/\n/g, "");
	  })
	  .on("end", function(data2){
		 console.log(chunk); 
	  });
} else if(process.argv[3].indexOf("http") > -1){
	request
  .get(process.argv[3])
  .pipe(speechClient.createRecognizeStream({
		config: optionAudio,
		singleUtterance: false,
		interimResults: false
	  }))
	  .on('error', console.error)
	  .on('data', function(data) {
		
		chunk= chunk + data.results;
		chunk = chunk.replace(/\n/g, "").replace(/undefined/g, "");
	  })
	  .on("end", function(data2){
		console.log(chunk);	 
	  });
} else if(process.argv[3].indexOf("id=") === 0){
	var audioLink = "https://drive.google.com/uc?"+process.argv[3]+"&export=download";
	request
  .get(audioLink)
  .pipe(speechClient.createRecognizeStream({
		config: optionAudio,
		singleUtterance: false,
		interimResults: false
	  }))
	  .on('error', console.error)
	  .on('data', function(data) {
		
		chunk= chunk + data.results;
		chunk = chunk.replace(/\n/g, "").replace(/undefined/g, "");
	  })
	  .on("end", function(data2){
		console.log(chunk);	 
	  });
}

  
  