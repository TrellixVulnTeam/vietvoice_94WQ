var express = require('express');
var app = express();
app.listen(80);

app.get("/", function(req,res){
	//speechToTextVn(idList[0]);
	res.end("OK");
}); 


app.get("/test", function(req,res){	
	res.end("hello world");
}); 
  