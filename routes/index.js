var express = require('express');
var router  = express.Router();
var _mysql  = require('mysql');

var HOST       = 'localhost';
var PORT       = 3306;
var MYSQL_USER = 'root';
var MYSQL_PASS = '';
var DATABASE   = 'poundr';
var TABLE      = '';

var dbConfig = {
	host     : HOST,
	port     : PORT,
	user     : MYSQL_USER,
	password : MYSQL_PASS,
	database : DATABASE,
	debug    : true
};

var connection = _mysql.createConnection( dbConfig );

/* GET home page. */
router.index = function(req, res) {
	res.render('index', { title: 'Super Awesome Chatroom' });
};

// JSON API for list of polls
router.list = function(req, res) {
	// var currentId = req.params.currentId;
	// var connection = req.connection;

	connection.query('SELECT id, name, fan_page, facebook_id FROM celebrities LIMIT 0,10',
		function(error, celebrities) {
			if (error) {
				console.log('ERROR: ' + error);
				return;
			}
			res.json( celebrities );
		}
	);
};

module.exports = router;