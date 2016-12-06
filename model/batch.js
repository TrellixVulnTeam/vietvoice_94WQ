var gcloud = require('google-cloud');
var speech = gcloud.speech;
var request = require('superagent');
var fs = require('fs');
var exec = require('child-process-promise').exec;

var checkAudioExist = require('./checkAudioExist');
var addAudioAndText = require('./addAudioAndText');

var optionFlac = {
	encoding: 'FLAC',
	sampleRate: 16000,
	languageCode: "vi-VN"
};
var optionRaw = {
	encoding: 'LINEAR16',
	sampleRate: 16000,
	languageCode: "vi-VN"
};
var optionAudio = optionFlac;
var speechClient = speech({
	projectId: 'vietvoice-144807',
	keyFilename: 'Vietvoice-9bf9e4706430.json'
});


function speechToTextVn(audioID, callback, arr, i, result, fileName) {
	var audioWav = fs.createWriteStream(fileName+'.wav');
	console.log(`i: ${i}`);
	//console.log('result:');
	//console.log(result);
	checkAudioExist({
		driveID: audioID
	}, function(boo) {
		if (boo === true) {
			i++;
			if (i < arr.length) {
				speechToTextVn(arr[i].driveID, callback, arr, i, result, fileName);
			}
			else {
				callback(result);
			}
		}
		else {
			var chunk = '';
			var audioLink = "https://drive.google.com/uc?id=" + audioID + "&export=download";
			fs.unlink(fileName+'.flac', function() {
				request
					.get(audioLink)
					.on('error', function(err) {
						console.log(err)
					})
					.pipe(audioWav);
			});

			audioWav.on('close', function() {
				//console.log('done downloading file');
				exec('ffmpeg -i '+fileName+'.wav -acodec flac -bits_per_raw_sample 16 -ar 16000 -ac 1 '+fileName+'.flac')
					.then(function(rr) {
						//console.log("done converting audio");
						fs.createReadStream(fileName+'.flac')
							.on('error', console.error)
							.pipe(speechClient.createRecognizeStream({
								config: optionAudio,
								singleUtterance: false,
								interimResults: false
							}))
							.on('error', console.error)
							.on('data', function(data) {
								chunk = chunk + data.results;
								chunk = chunk.replace(/\n/g, "").replace(/undefined/g, "");
							})
							.on("end", function(data2) {
								console.log(chunk);
								//console.log(result);
								result.push({
									link: "https://drive.google.com/uc?id=" + audioID + "&export=download",
									text: chunk,
									name: arr[i].name,
									driveID: arr[i].driveID
								});
								addAudioAndText({
									link: "https://drive.google.com/uc?id=" + audioID + "&export=download",
									text: chunk,
									name: arr[i].name,
									driveID: arr[i].driveID,
									checked: 0,
									textFix: [chunk]
								});
								i++;
								if (i < arr.length) {
									speechToTextVn(arr[i].driveID, callback, arr, i, result, fileName);
								}
								else {
									callback(result);
								}
							});
					})
					.catch(function(err) {
						console.error('ERROR: ', err);
						i++;
						if (i < arr.length) {
							speechToTextVn(arr[i].driveID, callback, arr, i, result, fileName);
						} 
						else {
							callback(result);
						}
					});
			});


		}
	});
}

function speechNext(audioID) {
	speechToTextVn(audioID);
}

module.exports = function(arr, fileName) {
	if (arr.length === 0) {
		return new Promise(function(resolve, reject) {
			resolve([]);
		});
	}
	else {
		return new Promise(function(resolve, reject) {
			var result = [];
			var i = 0;
			speechToTextVn(arr[i].driveID, resolve, arr, i, result, fileName);
		});
	}
}
