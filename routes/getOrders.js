var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var mysql      = require('mysql');
var connection = require('./../configuration/mySqlConnection');

/* In order to update the contact */
router.post('/', function(req, res) {

	var role = req.session.role;
	if(role === "admin") {
		
		var query = "SELECT * FROM orders_table";

		connection.query(query,function(err,rows){
		    if(err) {
		        res.json({"message" : "There was a problem with this action"});
		    } else {

				res.json({"products":rows,"message" : "01 - The request was successful"});
			}
		});
	} else {
		res.json({"message":"02 - you need to log in as an admin prior to making the request"});
	}
});

module.exports = router;  