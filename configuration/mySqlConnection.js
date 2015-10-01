var mysql = require("mysql");

var connection = mysql.createConnection({
	    /*host     : 'mysql-instance1.ckjgb2zflews.us-east-1.rds.amazonaws.com',*/
	    host	 : 'localhost',
	    user     : 'root',
	    /*password : 'aishwarya',*/
	    password : 'root',
	    database : 'ecommercedb',
	    port:3306
});

module.exports = connection;
