var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var mysql      = require('mysql');
var connection = require('./../configuration/mySqlConnection');


/* For user log in */
router.post('/', function(req, res) {

    var query = "SELECT * FROM ?? WHERE ??=? AND ??=?";
    var table = ["users_table","username",req.body.username,"password",req.body.password];
    query = mysql.format(query,table);

    connection.query(query,function(err,rows){
        if(err) {
            res.json({"Success" : false, "Message" : "MSQL Error."});
        } else {
             if(typeof rows == 'undefined' || rows.length <=0 ) {
                res.json({"Success" : false, "err_message" : "That username and password combination was not correct"});
             }
             else {

                //Correct login - set session expiry to 15 minutes
                req.session.cookie.maxAge = new Date(Date.now() + (  15 * 60 * 1000));
                //req.session.cookie.maxAge = new Date(Date.now() + (8 * 1000));

                //Store user related information in session
                req.session.username = req.body.username;
                req.session.role = rows[0].role;
                req.session.userID = rows[0].user_id;

                insertSessionInfo(req);

                if(rows[0].role === "admin") {
                    //Admin menu
                    res.json({"Success" : true, "AdminMenu1" : "/logout", "AdminMenu2" : "/updateInfo", "AdminMenu3":"/modifyProduct","AdminMenu4":"/viewUsers","AdminMenu5":"/getProducts", "AdminMenu6" : "/buyProduct", "AdminMenu7" : "/getOrders"});
                } else {
                    //Customer menu
                    res.json({"Success" : true, "Menu1" : "/logout", "Menu2" : "/updateInfo", "Menu3":"/getProducts", "Menu4" : "/buyProduct"});
                }
             }
        }
    });
});

function insertSessionInfo(req) {
    var userID = req.session.userID;

    // timestamp with UTC time
    //console.log(moment.utc());
    //console.log(moment.utc().format('ddd MMM DD YYYY HH:mm:ss z'));

    query = "insert into session_info_table values('"+req.sessionID+"','"+userID+"');";

    console.log("Query : "+query);
    /*connection.query(query,function(err,rows){
        if(err) {
            console.log(err);
        }
    });*/
}

module.exports = router;
