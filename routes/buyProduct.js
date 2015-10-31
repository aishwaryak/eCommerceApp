var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var mysql      = require('mysql');
var connection = require('./../configuration/mySqlConnection');

/* In order to update the contact */
router.post('/', function(req, res) {

	var userId = req.session.userID;
	if(typeof userId !== undefined && userId != undefined) {
		//TODO - change table name
		var query = "SELECT quantity FROM product_inventory_table WHERE product_id="+req.body.productId;

	    connection.query(query,function(err,rows){
	        if(err) {
	        	console.log("Error : "+err);
	        } else {
	            //console.log(rows[0].quantity);
	            var currentQuantity = rows[0].quantity;
	            buyProduct(currentQuantity,req,res);
	
	        }
	    });
		
	} else {
		res.json({"message" : "02 - you need to log in prior to buying a product"});
	}
	
});

function buyProduct(currentQuantity,req,res) {
    if(currentQuantity > 0) {
    	currentQuantity--;
    	var query = "UPDATE product_inventory_table SET quantity="+currentQuantity+" WHERE product_id="+req.body.productId;
    	connection.query(query,function(err,rows){
	        if(err) {
	        	console.log("Error : "+err);
	        } else {
	        	//Insert or update in the orders table
	        	query = "INSERT INTO orders_table (product_id, quantity_sold) VALUES ("+req.body.productId+", 1) ON DUPLICATE KEY UPDATE quantity_sold = quantity_sold + 1;"
				connection.query(query,function(err,rows){
			        if(err) {
			        	console.log("Error : "+err);
			        } else {
	        			res.json({"message" : "01 - The purchase has been made successfully"});
	        		}
		        });
	        }
    	});

	} else {
		res.json({"message" : "02 - that product is out of stock"});
	}
}

module.exports = router;  