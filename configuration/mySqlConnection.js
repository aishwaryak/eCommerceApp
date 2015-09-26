console.log("Getting connection.. ");

var mysql = require("mysql");

var connection = mysql.createConnection({
	    host     : 'localhost',
	    user     : 'root',
	    password : 'root',
	    database : 'ecommercedb',
	    port:3306
});

module.exports = connection;
