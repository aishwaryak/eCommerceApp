var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var mysql      = require('mysql');
var connection = require('./../configuration/mySqlConnection');

/* For viewing products */
router.get('/', function(req, res) {

	var product_list={};
	var products = [];

	var completedFlag = 0;

	var productId = req.query.productId;

	if(typeof productId != 'undefined') {
		//check if there is a query parmeter productID
		productId = productId.trim();

		if(productId != "") {
			var query = "SELECT * FROM products_table WHERE product_id = "+productId+"";
			console.log(query);

		    connection.query(query,function(err,rows){
		        if(err) {
		            res.json({"Error" : true, "Message" : "Error executing MySQL query"});
		        } else {
		        	for(var attributename in rows){
					    //console.log(attributename+": "+rows[attributename]['productTitle']);
					    products.push(rows[attributename]['productTitle']);
					}
		        	//console.log(rows['productTitle']);
		        	product_list.products = products;
		        	res.json(product_list);

		        	//products.push(rows);
		        	//product_list.products = products;
		            //res.json(product_list);
		            return;
		        }
			});
		}//check if productid key is there, but no value

	} else {
		//Product ID is not given. Check for category or keyword query parameters

		var isCategory = false;
		var query = "";

		var keyword = req.query.keyword;
		if(typeof keyword != 'undefined') {
			//check if there is a query parmeter keyword
			keyword = keyword.trim();
		} else {
			keyword = "";
		}

		var categoryName = req.query.category;

		if(typeof categoryName != 'undefined') {
			//check if there is a query parameter category
			categoryName = categoryName.trim();
			isCategory = true;
		} else {
			categoryName = "";
		}

		if(isCategory) {
			//If there is a category include it in the query
			query = "SELECT distinct p.product_id,p.asin,p.productTitle,p.productGroup,p.productDescription,c.category_name FROM products_table AS p,product_category_table AS pc,category_table AS c WHERE p.product_id = pc.product_id AND pc.category_id = c.category_id AND (p.productTitle LIKE '%"+keyword+"%' OR p.productDescription LIKE '%"+keyword+"%') AND c.category_name = '"+categoryName+"'";
		} else {
			//If no category just select all products from the table that match the keyword (if given)
			query = "SELECT * FROM products_table WHERE productTitle LIKE '%"+keyword+"%' OR productDescription LIKE '%"+keyword+"%'";
		}

		//Executing the query
	    connection.query(query,function(err,rows){
	        if(err) {
	            res.json({"Error" : true, "Message" : "Error executing MySQL query"});
	        } else {
	        	//TODO
	        	for(var attributename in rows){
				    //console.log(attributename+": "+rows[attributename]['productTitle']);
				    products.push(rows[attributename]['productTitle']);
				}
	        	//console.log(rows['productTitle']);
	        	product_list.products = products;
	        	res.json(product_list);
	        }
		});
	} // else ending

});

module.exports = router;
