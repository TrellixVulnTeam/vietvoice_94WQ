var fs = require('fs');
var request = require('superagent');
var exec = require('child-process-promise').exec;

var audioWav = fs.createWriteStream('audio.wav');

fs.unlink('audio-result.raw', function() {
    request
        .get('https://drive.google.com/uc?id=0B-8QhEq5eqVLTk1vYy1hZ0dtNGs&export=download')
        .on('error', function(err) {
            console.log(err)
        })
        .pipe(audioWav);
});

audioWav.on('close', function() {
  console.log('file done');
  exec('ffmpeg -i audio.wav -f s16le -acodec pcm_s16le audio-result.raw')
    .then(function (result) {
        console.log("convert OK");
    });
});

