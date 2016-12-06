var fs = require('fs');
var readline = require('readline');
var google = require('googleapis');
var googleAuth = require('google-auth-library');
var checkAudioExist = require('./checkAudioExist');

// If modifying these scopes, delete your previously saved credentials
// at ~/.credentials/drive-nodejs-quickstart.json
var SCOPES = ['https://www.googleapis.com/auth/drive.metadata.readonly'];
var TOKEN_DIR = (process.env.HOME || process.env.HOMEPATH ||
    process.env.USERPROFILE) + '/.credentials/';
var TOKEN_PATH = TOKEN_DIR + 'drive-nodejs-quickstart.json';

function authorize(credentials, callback, moduleCallback, number) {
  var clientSecret = credentials.installed.client_secret;
  var clientId = credentials.installed.client_id;
  var redirectUrl = credentials.installed.redirect_uris[0];
  var auth = new googleAuth();
  var oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, function(err, token) {
    if (err) {
      getNewToken(oauth2Client, callback);
    } else {
      oauth2Client.credentials = JSON.parse(token);
      callback(oauth2Client, moduleCallback, number);
    }
  });
}


function getNewToken(oauth2Client, callback) {
  var authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES
  });
  console.log('Authorize this app by visiting this url: ', authUrl);
  var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  rl.question('Enter the code from that page here: ', function(code) {
    rl.close();
    oauth2Client.getToken(code, function(err, token) {
      if (err) {
        console.log('Error while trying to retrieve access token', err);
        return;
      }
      oauth2Client.credentials = token;
      storeToken(token);
      callback(oauth2Client);
    });
  });
}


function storeToken(token) {
  try {
    fs.mkdirSync(TOKEN_DIR);
  } catch (err) {
    if (err.code != 'EEXIST') {
      throw err;
    }
  }
  fs.writeFile(TOKEN_PATH, JSON.stringify(token));
  console.log('Token stored to ' + TOKEN_PATH);
}


function listFiles(auth, moduleCallback, number) {
  var service = google.drive('v3');
  service.files.list({
    auth: auth,
    pageSize: number,
    fields: "nextPageToken, files(id, name)"
  }, function(err, response) {
    if (err) {
      console.log('The API returned an error: ' + err);
      return;
    }
    var files = response.files;
    if (files.length == 0) {
      console.log('No files found.');
    } else {
      console.log('Files:');
	  var jsonFile = [];
      for (var i = 0; i < files.length; i++) {
        var file = files[i];        
		//console.log('%s (%s)', file.name, file.id);
		jsonFile.push({
			driveID: file.id,
			name: file.name
		});		
      }
	  //console.log(jsonFile);
	  moduleCallback(jsonFile);
	  
    }
  });
}

module.exports = function(number){
	return new Promise(function (moduleCallback, reject) {
		// Load client secrets from a local file.
		fs.readFile('client_secret.json', function processClientSecrets(err, content) {
		  if (err) {
			console.log('Error loading client secret file: ' + err);
			return;
		  }
		  // Authorize a client with the loaded credentials, then call the
		  // Drive API.
		  authorize(JSON.parse(content), listFiles, moduleCallback, number);
		});
	});
}