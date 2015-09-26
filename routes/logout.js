
var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

/* For user logging out*/
router.post('/', function(req, res, next) {

	console.log("Before logging out session : "+req.session);

	var user_id = req.session.userID;
	var sessionID = req.sessionID;
	var userInputSessionID = req.body.sessionID;

	//check if both the sessionIDs are same
	if(typeof user_id == 'undefined' || user_id.length <=0 ) {
		//Check if he has loggedout already
		res.json({"Message":"You are not currently logged in"});
	}
	else {
		//Destroy the session 
		req.session.destroy();
		res.json({"Message":"You have been logged out."});
	}
		
	console.log("After logging out session : "+req.session);
	console.log("After logging out sessionID : "+req.sessionID);
		
});

module.exports = router;