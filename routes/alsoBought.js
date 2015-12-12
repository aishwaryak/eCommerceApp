var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var mysql      = require('mysql');
var connection = require('./../configuration/mySqlConnection');

/* In order to update the contact */
router.post('/', function(req, res) {

	var role = req.session.role;
	if(role === "admin") {
		//Add the given products to the table

		var query = "SELECT * FROM also_bought_table WHERE (product_id_first = "+req.body.productId1+" AND product_id_second="+req.body.productId2+") OR (product_id_first="+req.body.productId2+" AND product_id_second = "+req.body.productId1+");";
		connection.query(query,function(err,rows){
	        if(err) {
	        	res.json({"message":"there was a problem processing the request"});
	        }
	        else {
	        	if(rows.length == 0)
	        		insertIntoTable(req,res,connection);
	        	else 
	        		res.json({"message":"the request was successful"}); 	
	        }
	    });

	} else {
		res.json({"message":"there was a problem processing the request"});
	}
});

function insertIntoTable(req,res,connection) {
	var query = "INSERT INTO also_bought_table(product_id_first,product_id_second) VALUES ("+req.body.productId1+","+req.body.productId2+");";
    connection.query(query,function(err,rows){
        if(err) {
        	res.json({"message":"there was a problem processing the request"});
        } else {
           res.json({"message":"the request was successful"}); 	           
        }
    });	
}

module.exports = router;  