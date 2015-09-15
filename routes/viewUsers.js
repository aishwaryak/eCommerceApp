var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var mysql      = require('mysql');

//Connectin to MYSQL Database
var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'root',
    database : 'ecommercedb'
});

connection.connect();

/* To view users */
router.get('/', function(req, res) {

    var role = req.session.role;


    var sessionID = req.sessionID;
    var userInputSessionID = req.query.sessionID;

    if(typeof userInputSessionID != 'undefined' && typeof sessionID != 'undefined' && userInputSessionID === sessionID) {

        //Check if the session IDs are the same.

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
            res.json({"Message":"Access Forbidden"});
        }

    } else {
        //If session ids dont match
        res.send({"Message":"You have not provided the correct session ID."});
    }

   


});

module.exports = router;