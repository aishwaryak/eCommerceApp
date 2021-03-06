var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var mysql      = require('mysql');

//Connectin to MYSQL Database
var connection = mysql.createConnection({
    host     : 'mysql-instance1.c90szr4335oh.us-west-2.rds.amazonaws.com',
    user     : 'root',
    password : 'aishwarya',
    database : 'ecommercedb',
    port:3306
});

connection.connect();

/* For modifying product information */

router.post('/', function(req, res) {

	var role = req.session.role;
	var productId = "";
	var updateQuery = "UPDATE products_table SET ";

	//Read all parameters
	for (var property in req.body) {
		if(property === "productId") {
			productId = req.body[property];
		} else if(property != "sessionID") {
		    console.log(property + " is " + req.body[property]);
	   		updateQuery=updateQuery+property+" = '"+req.body[property]+"', ";
		}
	}
	//Remove the final comma
	updateQuery = updateQuery.substring(0, updateQuery.length - 2);
	updateQuery = updateQuery+ " WHERE product_id = "+productId+"";

	if(role === "admin") {
		connection.query(updateQuery,function(err,rows){
		    if(err) {
		        res.json({"Message" : "There was a problem with this action"});
		    } else {
		    	if(rows.changedRows <=0 ) {
		    		res.json({"Message" : "No rows were updated."});
		    	}
		    	else {
		        	res.json({"Message" : "The product information has been updated"});
		        }
		    }
		});
	} else {
		res.json({"Message" : "There was a problem with this action - only admin can update"});
	}
	
});

module.exports = router;
