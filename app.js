
var express = require("express");
var mysql   = require("mysql");
var bodyParser  = require("body-parser");
var md5 = require('MD5');
var rest = require("./REST.js");
var app  = express();

var session = require('express-session');
var path = require('path');
var RedisStore = require('connect-redis')(express);
/*var BetterMemoryStore = require(__dirname + '/memory')
var store = new BetterMemoryStore({ expires: 1000, debug: true })*/

app.use(express.session({ store: new RedisStore }));

app.use(session({
  store: new RedisStore({
      host:'127.0.0.1',
      port:6380,
      prefix:'sess'
  }),
  resave: false, 
  saveUninitialized: true,
  name:'ecommerceSession', 
  secret: 'SecretCode',
  /*cookie:{maxAge:new Date(Date.now() + (20 * 1000))} */ //TODO - as of now it is 20 seconds
  rolling:true
}));


//require('express-session')({ ..., store: store, ... })

/*app.use(session({secret: 'a secret'}, {
  cookie: {
    path: '/',
    httpOnly: true,
    secure: false,
    maxAge: 1000
  },
  rolling: true
}));
*/

app.use(express.static(path.join(__dirname, 'public')));

function REST(){
    var self = this;
    self.connectMysql();
};

REST.prototype.connectMysql = function() {
    var self = this;
    var pool      =    mysql.createPool({
        connectionLimit : 100,
        /*host     : 'localhost',*/
        host     : 'mysql-instance1.ckjgb2zflews.us-east-1.rds.amazonaws.com',
        user     : 'root',
        /*password : 'root',*/
        password : 'aishwarya',
        database : 'ecommercedb',
        debug    :  false
    });
    pool.getConnection(function(err,connection){
        if(err) {
          self.stop(err);
        } else {
          self.configureExpress(connection);
        }
    });
}

REST.prototype.configureExpress = function(connection) {
      var self = this;
      app.use(bodyParser.urlencoded({ extended: true }));
      app.use(bodyParser.json());
      var router = express.Router();
      app.use('/', router);
      var rest_router = new rest(router,connection,md5);
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
