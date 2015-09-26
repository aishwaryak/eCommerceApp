var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var mysql      = require('mysql');
var connection = require('./../configuration/mySqlConnection');

/* For registering users - url is 'register' */
router.post('/', function(req, res) {

	var query = "INSERT INTO ??(??,??,??,??,??,??,??,??,??,??) VALUES (?,?,?,?,?,?,?,?,?,?)";
        
    var table = ["users_table","firstname","lastname","role","address","city","state","zip","email","username","password",req.body.fname,req.body.lname,"customer",req.body.address,req.body.city,req.body.state,req.body.zip,req.body.email,req.body.username,req.body.password];
    
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
