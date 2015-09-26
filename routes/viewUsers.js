var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var mysql      = require('mysql');
var connection = require('./../configuration/mySqlConnection');


/* To view users */
router.get('/', function(req, res) {

    var role = req.session.role;


    var sessionID = req.sessionID;
    var userInputSessionID = req.query.sessionID;

         if(typeof role != 'undefined' && role === "admin") {
        //Only admin can view users

        var query = "SELECT * FROM users_table WHERE firstname LIKE ";//?? OR lastname LIKE ??";

        //Check the first and last name sent in request
        if(typeof req.query.fname == 'undefined' || req.query.fname.length <=0 ) {
            fname="'%'";
        } else {
            fname="'%"+req.query.fname+"%'";
        }

        query=query+fname+" AND lastname LIKE ";
         
        if(typeof req.query.lname == 'undefined' || req.query.lname.length <=0 ) {
            lname="'%'";    
        } else {
            lname="'%"+req.query.lname+"%'";
        }   
        query = query+lname;

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
