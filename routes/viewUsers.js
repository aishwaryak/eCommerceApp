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

/* To view users */
router.get('/', function(req, res) {

    var role = req.session.role;


    var sessionID = req.sessionID;
    var userInputSessionID = req.query.sessionID;

         if(role === "admin") {
        //Only admin can view users

        var query = "SELECT * FROM users_table WHERE firstname LIKE ";//?? OR lastname LIKE ??";

        //Check the first and last name sent in request
        if(typeof req.query.fName == 'undefined' || req.query.fName.length <=0 ) {
            fName="'%'";
        } else {
            fName="'%"+req.query.fName+"%'";
        }

        query=query+fName+" AND lastname LIKE ";
         
        if(typeof req.query.lName == 'undefined' || req.query.lName.length <=0 ) {
            lName="'%'";    
        } else {
            lName="'%"+req.query.lName+"%'";
        }   
        query = query+lName;

        //console.log("Query:"+query);

        connection.query(query,function(err,rows){
            if(err) {
                res.json({"Error" : true, "Message" : "Error executing MySQL query"});
            } else {
                res.json({"Error" : false, "Message" : "Success", "Users" : rows});
            }
        });

        } else {
            //If not admin, access forbidden
            res.json({"Message":"There was a problem with this action - only admin can access"});
        }

});

module.exports = router;
