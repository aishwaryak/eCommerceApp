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

/* For user log in */
router.post('/', function(req, res) {

        if(typeof req.session.username == 'undefined') {

            var query = "SELECT * FROM ?? WHERE ??=? AND ??=?";
            var table = ["users_table","username",req.body.username,"password",req.body.password];
            query = mysql.format(query,table);

            connection.query(query,function(err,rows){
                if(err) {
                    res.json({"Success" : false, "Message" : "MSQL Error."});
                } else {
                     if(typeof rows == 'undefined' || rows.length <=0 ) {
                        res.json({"Success" : false, "Message" : "That username and password combination was not correct"});
                     }
                     else {

                        //Store user related information in session
                        req.session.username = req.body.username;
                        req.session.role = rows[0].role;
                        req.session.userID = rows[0].user_id;

                        if(rows[0].role === "admin") {
                            res.json({"Success" : true, "AdminMenu1" : "AdminMenu...", "AdminMenu2" : "AdminMenu...", "SessionID" :req.sessionID});
                        } else {
                            res.json({"Success" : true, "Menu1" : "Menu1", "Menu2" : "Menu2", "SessionID" :req.sessionID});
                        }
                     }
                }
            });

        } //check if some user has been logged in already
        else {
            res.json({'Message':'User logged in already'});
        }
});

module.exports = router;