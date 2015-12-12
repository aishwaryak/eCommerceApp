var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var mysql      = require('mysql');
var connection = require('./../configuration/mySqlConnection');

/* In order to update the contact */
router.post('/', function(req, res) {

		var query = "SELECT * FROM also_bought_table where product_id_first="+req.body.productId+" OR product_id_second="+req.body.productId+" LIMIT 5";

		connection.query(query,function(err,rows){
		    if(err) {
		        res.json({"message" : "there was a problem processing the request"});
		    } else {
		    	var relatedProducts = [];
		    	for(var iterator=0;iterator<rows.length;iterator++) {
		    		var row = rows[iterator];

		    		if(row.product_id_second == req.body.productId)	 {
		    			relatedProducts.push(row.product_id_first);
		    		}
		    		if(row.product_id_first == req.body.productId) {
		    			relatedProducts.push(row.product_id_second);
		    		}
		    		//console.log(row['product_id_first']);
		    		//console.log(row['product_id_second']);
		    	}
		    	res.json({"message" : "the request was successful","relatedProducts":relatedProducts});
			}
		});

	});

module.exports = router;  