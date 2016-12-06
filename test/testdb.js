var addUser = require('../model/addUser');
addUser({
	"ghe": "gom",
	"chan": "that"
}, function(id){
	console.log(id);
});
   