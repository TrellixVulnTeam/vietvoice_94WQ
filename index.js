var gcloud = require('google-cloud');
var speech = gcloud.speech;
var request = require('superagent');
var fs = require('fs');
var express = require('express');
var bodyParser = require("body-parser");
var ObjectId = require('mongodb').ObjectId;
var app = express();
app.listen(80);


//model
var getLatestAudioFromDrive = require('./model/getLatestAudioFromDrive');
var batchSpeechDetect = require('./model/batchSpeechDetect');
var get0check = require('./model/get0check');
var get0checkrandom = require('./model/get0checkrandom');
var updateAudioText = require('./model/updateAudioText');
var findUser = require('./model/findUser');
var cookie = require('./model/cookie');
var addUser = require('./model/addUser');
var findAudio = require('./model/findAudio');
var getRandomSetting = require('./model/getrandomsetting');
var editRandomSetting = require('./model/editrandomsetting');
var getNext = require('./model/getNext');
var getCorrect = require('./model/getCorrect');

//middleware
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/views'));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get("/importfile/:number", function(req, res) {
    var numberOfFile = isNaN(Number(req.params.number)) ? 1 : Number(req.params.number);
    getLatestAudioFromDrive(numberOfFile)
        .then(function(data) {
            var filterData = data.filter(function(val) {
                return val.name.indexOf(".wav") > -1;
            });
            return batchSpeechDetect(filterData);
        })
        .then(function(result) {
            if (result.length === 0) {
                res.json({
                    message: "Những file này đã được import rồi"
                });
            }
            else {
                res.json(result);
            }
        });
});

app.get("/getrandomcheck", function(req, res) {
    get0checkrandom({
        "checked": 0
    }, function(doc) {
        res.json(doc);
    });
});

app.get("/getrandomcheck/:number", function(req, res) {
    get0checkrandom({
        "checked": Number(req.params.number)
    }, function(doc) {
        res.json(doc);
    });
});

app.get("/getnext/:fileName", function(req, res) {
    getNext(req.params.fileName, function(doc) {
        res.send(doc);
    });
});

app.post("/updateaudio", function(req, res) {
    updateAudioText(req.body, function(record) {
        res.end("OK");
    });
});

app.get('/checklogin', function(req, res) {
    console.log(JSON.stringify(cookie(req)));
    if (!cookie(req).user) {
        res.end("false");
    }
    else {
        var validateCookie = {
            "_id": ObjectId(cookie(req).au),
            "username": cookie(req).user
        };
        findUser(validateCookie, function(docs) {
            if (docs.length > 0) {
                res.end(cookie(req).user);
            }
            else {
                res.end("false");
            }
        });
    }
});

function checkLogin(req, res, callback) {
    if (!cookie(req).user) {
        res.end("authentication false");
    }
    else {
        var validateCookie = {
            "_id": ObjectId(cookie(req).au),
            "username": cookie(req).user
        };
        findUser(validateCookie, function(docs) {
            if (docs.length > 0) {
                callback();
            }
            else {
                res.end("authentication false");
            }
        });
    }
}

app.get('/checklogin', function(req, res) {
    console.log(JSON.stringify(cookie(req)));
    if (!cookie(req).user || cookie(req).au == "undefined" || cookie(req).au.length !== 24) {
        res.end("false");
    }
    else {
        var validateCookie = {
            "_id": ObjectId(cookie(req).au),
            "username": cookie(req).user
        };
        findUser(validateCookie, function(docs) {
            if (docs.length > 0) {
                res.end(cookie(req).user);
            }
            else {
                res.end("false");
            }
        });
    }
});

app.post("/login", function(req, res) {
    console.log(req.body);
    findUser({
        "username": req.body.username
    }, function(docs) {
        console.log(docs);
        if (docs.length > 0) {
            if (docs[0].password === req.body.password) {
                res.send({
                    message: "success",
                    cookie: docs[0]._id
                });
            }
            else {
                res.send({
                    message: "Sai mật khẩu",
                    cookie: null
                });
            }
        }
        else {
            res.send({
                message: "Tài khoản không tồn tại"
            });
        }
    });
    console.log(JSON.stringify(req.body));
});


app.get("/getuserlink/:username", function(req, res) {
    findUser({
        "username": req.params.username
    }, function(doc) {
        res.end(typeof doc[0].link == "undefined" ? "" : doc[0].link);
    });
});

app.post("/adduser", function(req, res) {
    if (!cookie(req).user) {
        res.end("authentication false");
    }
    else {
        if (cookie(req).user !== "admin") {
            res.end("authentication false");
        }
        else {
            var validateCookie = {
                "_id": ObjectId(cookie(req).au),
                "username": cookie(req).user
            };
            findUser(validateCookie, function(docs) {
                if (docs.length <= 0) {
                    res.end("authentication false");
                }
                else {
                    //main function here

                    addUser(req.body, function(record) {
                        res.send(record);
                    });
                }
            });
        }

    }
});

app.get("/audioresults/:checkedtime", function(req, res) {
    findAudio({
        "checked": Number(req.params.checkedtime)
    }, function(docs) {
        res.send({
            "count": docs.length
        });
    });
});


app.get("/getrandomsetting", function(req, res) {
    getRandomSetting(function(data) {
        res.send(data);
    })
});

app.post("/editrandomsetting", function(req, res) {
    editRandomSetting(req.body, function() {
        res.send("OK");
    })
});


app.get("/correct", function(req, res) {
    getCorrect(function(docs) {
        if (docs.length === 0) {
            res.send(["Chưa có dữ liệu, những file check đủ 5 lần đúng thì mới được coi là chuẩn"]);
        }
        else {
            docs = docs.map(function(val, index) {
                // get text with highest appear times
                function checkTimeAppear(arr, index) {
                    var item = arr[index];
                    var i = 0;
                    var newArr = arr.filter(function(val) {
                        return val !== item;
                    });
                    return arr.length - newArr.length;
                }
                var newFoo = val.textFix.map(function(val, index, arr) {
                    return [checkTimeAppear(arr, index), val];
                });

                var highestF = newFoo.slice(0).sort(function(a, b) {
                    return b[0] - a[0]
                })[0][0];
                var result = newFoo
                    .slice(0)
                    .filter(function(val) {
                        return val[0] === highestF;
                    })
                    .map(function(val, index) {
                        return val[1];
                    })
                    .filter(function(val, index, arr) {
                        return arr.indexOf(val) === index;
                    });
                    
                // create new object
                return {
                    link: val.link,
                    name: val.name,
                    driveID: val.driveID,
                    text: result
                };
            });
            res.send(docs);
        }
    });
});


app.get("/correctone", function(req, res) {
    getCorrect(function(docs) {
        if (docs.length === 0) {
            res.send(["Chưa có dữ liệu, những file check đủ 5 lần đúng thì mới được coi là chuẩn"]);
        }
        else {
            docs = docs.map(function(val, index) {
                // get text with highest appear times
                function checkTimeAppear(arr, index) {
                    var item = arr[index];
                    var i = 0;
                    var newArr = arr.filter(function(val) {
                        return val !== item;
                    });
                    return arr.length - newArr.length;
                }
                var newFoo = val.textFix.map(function(val, index, arr) {
                    return [checkTimeAppear(arr, index), val];
                });

                var highestF = newFoo.slice(0).sort(function(a, b) {
                    return b[0] - a[0]
                })[0][0];
                var result = newFoo
                    .slice(0)
                    .filter(function(val) {
                        return val[0] === highestF;
                    })
                    .map(function(val, index) {
                        return val[1];
                    })
                    .filter(function(val, index, arr) {
                        return arr.indexOf(val) === index;
                    });
                    
                // create new object
                return {
                    link: val.link,
                    name: val.name,
                    driveID: val.driveID,
                    text: result[0]
                };
            });
            res.send(docs);
        }
    });
});