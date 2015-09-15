
var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

/* For user logging out*/
router.post('/', function(req, res, next) {
	var user_id = req.session.userID;
	
	var sessionID = req.sessionID;
	var userInputSessionID = req.body.sessionID;

	if(typeof userInputSessionID == 'undefined' || userInputSessionID.length <=0 ) {
		//no session id inputted by user
		res.json({"Message":"Provide a session ID to log out."});
	} else {

		if(userInputSessionID === sessionID) {
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
		} else {
			//Session IDs are not the same
			res.json({"Message":"You are not currently logged in"});
		}
	}
});

module.exports = router;