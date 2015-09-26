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
                req.session.cookie.maxAge = new Date(Date.now() + (15 * 60 * 1000));

                //Store user related information in session
                req.session.username = req.body.username;
                req.session.role = rows[0].role;
                req.session.userID = rows[0].user_id;

                if(rows[0].role === "admin") {
                    //Admin menu
                    res.json({"Success" : true, "AdminMenu1" : "AdminMenu...", "AdminMenu2" : "AdminMenu...", "SessionID" :req.sessionID});
                } else {
                    //Customer menu
                    res.json({"Success" : true, "Menu1" : "Menu1", "Menu2" : "Menu2", "SessionID" :req.sessionID});
                }
             }
        }
    });
});

module.exports = router;
