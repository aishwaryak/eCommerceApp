var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var mysql      = require('mysql');
var connection = require('./../configuration/mySqlConnection');

/* In order to update the contact */
router.post('/', function(req, res) {

	//TODO  - this in all files
	////////////////////////////////////////////////////////////////////////
    var checkSession = require('./../configuration/sessionExpired');

    var hasExpired = checkSession.isSessionActive(req, function(response){
        console.log(response);
    });
    
    ///////////////////////////////////////////////////////////////////////

	var sessionID = req.sessionID;
	var userInputSessionID = req.body.sessionID;
	var isUserNameChanged = false; // To check if the username is changed.
									// So that the session variable is updated.
	var userId = req.session.userID;								

	//if(typeof userInputSessionID != 'undefined' && typeof sessionID != 'undefined' && userInputSessionID === sessionID) {
	  if(typeof userId != 'undefined') {	
		//Check if the session IDs are the same.

		var updateQuery = "UPDATE users_table SET ";
		var flag = 0; //To check if any paramter is being sent at all in first place

		if(typeof req.body.fname != 'undefined' && req.body.fname.length >0 ) {
			flag = 1;
			updateQuery = updateQuery+ "firstname = '"+req.body.fname+"' , ";
		}
		if(typeof req.body.lname != 'undefined' && req.body.lname.length >0 ) {
			flag = 1;	
			updateQuery = updateQuery+ "lastname = '"+req.body.lname+"' , ";
		}
		if(typeof req.body.address != 'undefined' && req.body.address.length >0 ) {
			flag = 1;
			updateQuery = updateQuery+ "address = '"+req.body.address+"' , ";
		}
		if(typeof req.body.city != 'undefined' && req.body.city.length >0 ) {
			flag = 1;
			updateQuery = updateQuery+ "city = '"+req.body.city+"' , ";
		}
		if(typeof req.body.state != 'undefined' && req.body.state.length >0 ) {
			flag = 1;
			updateQuery = updateQuery+ "state = '"+req.body.state+"' , ";
		}
		if(typeof req.body.zip != 'undefined' && req.body.zip.length >0 ) {
			flag = 1;
			updateQuery = updateQuery+ "zip = '"+req.body.zip+"' , ";
		}
		if(typeof req.body.email != 'undefined' && req.body.email.length >0 ) {
			flag = 1;
			updateQuery = updateQuery+ "email = '"+req.body.email+"' , ";
		}
		if(typeof req.body.username != 'undefined' && req.body.username.length >0 ) {
			flag = 1;
			isUserNameChanged = true;
			updateQuery = updateQuery+ "username = '"+req.body.username+"' , ";
		}
		if(typeof req.body.password != 'undefined' && req.body.password.length >0 ) {
			flag = 1;
			updateQuery = updateQuery+ "password = '"+req.body.password+"' , ";
		}

		if(flag==1) {
			//Check if any of the data is sent

			updateQuery = updateQuery.substring(0, updateQuery.length - 2); //Remove the last extra comma
			//var username = req.session.username;

			updateQuery = updateQuery+ " WHERE user_id = '"+req.session.userID+"'";
			//username is the user who has logged in

			updateQuery = mysql.format(updateQuery);

			//console.log("*"+updateQuery+"*");

			connection.query(updateQuery,function(err,rows){
	            if(err) {
	                res.json({"Message" : "There was a problem with this action"});
	            } else {
	            	if(rows.changedRows <=0 ) {
	            		//Check if any rows are changed
			    		res.json({"Message" : "No rows were updated"});
			    	} else {
	                	res.json({"Message" : "Your information has been updated"});
			    	}
	            }
	        });
		}
		else {
			res.json({'Message':'There was a problem with this action - No data sent'});
		}
	}
	else {
		//Session IDs are not the same
		res.json({'Message':'There was a problem with this action - No user logged in/Wrong session id provided'});
	} 
});

module.exports = router;  
