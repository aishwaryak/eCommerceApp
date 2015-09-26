var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var mysql      = require('mysql');
var connection = require('./../configuration/mySqlConnection');

var isSessionActive = function(req, callback) {
	var hasExpired;
    var sessionExpiry = req.session.cookie.expires;
    
    console.log("now date : "+Date.now());
    console.log("session dat : "+Date.parse(sessionExpiry));

    if(isNaN(parseFloat(sessionExpiry)) || typeof sessionExpiry == 'undefined') {
    	hasExpired = true;
    } else {
	    if(Date.now() > Date.parse(sessionExpiry)) {
        console.log("Session has expired");
        hasExpired = true;
        req.session.destroy();
	    } else {
	    	hasExpired = false;
	        console.log("Session not expired");
	    }
    }


	return callback(hasExpired);

};

module.exports.isSessionActive = isSessionActive;