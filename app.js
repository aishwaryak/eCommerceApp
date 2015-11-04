
var express = require("express");
var mysql   = require("mysql");
var cookieParser = require('cookie-parser');
var connect = require("connect");
var session = require('express-session');
var bodyParser  = require("body-parser");
var md5 = require('MD5');
var rest = require("./REST.js");
var app  = express();


var path = require('path');

var SessionStore = require('express-mysql-session');

var options = {
    host: 'localhost',
    // host     : 'mysql-instance1.ckjgb2zflews.us-east-1.rds.amazonaws.com',
    port: 3306,
    user: 'root',
    password: 'root',
    //password: 'aishwarya',
    database: 'ecommercedb'
};

var sessionStore = new SessionStore(options);


app.use(session({
  store: sessionStore,
  resave: false, 
  saveUninitialized: true,
  name:'ecommerceSession', 
  secret: 'SecretCode',
  rolling:true
}));


app.use(express.static(path.join(__dirname, 'public')));

function REST(){
    var self = this;
    self.configureExpress();
};


REST.prototype.configureExpress = function(connection) {
      var self = this;
      app.use(bodyParser.urlencoded({ extended: true }));
      app.use(bodyParser.json());
      var router = express.Router();
      app.use('/', router);
      var rest_router = new rest(router);
      self.startServer();
}

REST.prototype.startServer = function() {
      app.listen(8000,function(){
          console.log("Server running at Port 8000.");
      });
}

REST.prototype.stop = function(err) {
    console.log("ISSUE WITH MYSQL \n" + err);
    process.exit(1);
}

new REST();
