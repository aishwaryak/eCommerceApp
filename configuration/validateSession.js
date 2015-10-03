var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var mysql      = require('mysql');
var connection = require('./../configuration/mySqlConnection');
var moment = require('moment');

/*var isValidSession = function(req, callback) {
	var isValid;
	var sessionID = req.sessionID;

	query = "SELECT * FROM session_info_table WHERE session_id='"+sessionID+"'";//" AND hasSessionExpired = false";

 	//var currentUTCTime = Date.parse(moment.utc());

	connection.query(query,function(err,rows){
		console.log("query is "+query);
        if(err) {
            isValid = "Error";
        } else {
        	if(typeof rows !== 'undefined' || rows.length >0 ) {
        		//expiryTime = Date.parse(rows[0].expiryTime);
        		isValid = true;
        	}	
        	else {
        		//Session does not exist
        		console.log("false because it does not exist");
        		isValid = false;
        	}
        }
		return callback(isValid);
    });
};*/

var isValidSession = function(req, callback) {
    var isValid = false;
    var sessionID = req.sessionID;

    if(typeof sessionID!= undefined)
        isValid = true;
    return callback(isValid);
};

module.exports.isValidSession = isValidSession;