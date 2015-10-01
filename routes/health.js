var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

router.get('/', function(req, res) {
	console.log("Server Healthy..");
	res.json({'Status':'Healthy'});
});

module.exports = router;