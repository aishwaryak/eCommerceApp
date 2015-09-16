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

/* For registering users - url is 'register' */
router.post('/', function(req, res) {

	var query = "INSERT INTO ??(??,??,??,??,??,??,??,??,??,??) VALUES (?,?,?,?,?,?,?,?,?,?)";
        
    var table = ["users_table","firstname","lastname","role","address","city","state","zip","email","username","password",req.body.fName,req.body.lName,"customer",req.body.address,req.body.city,req.body.state,req.body.zip,req.body.email,req.body.uName,req.body.pWord];
    
    query = mysql.format(query,table);
    connection.query(query,function(err,rows){
        if(err) {
        	console.log(query);
            res.json({"Success" : false, "Message" : "There was a problem with your registration"});
        } else {
            console.log(rows);
            res.json({"Success" : true, "Message" : "Your account has been registered"});
        }
    });
});

module.exports = router;  
