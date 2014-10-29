var _mysql       = require('mysql');

var HOST       = 'localhost';
var PORT       = 3306;
var MYSQL_USER = 'root';
var MYSQL_PASS = '';
var DATABASE   = 'poundr';
var TABLE      = '';

var dbConfig = {
	host               : HOST,
	port               : PORT,
	user               : MYSQL_USER,
	password           : MYSQL_PASS,
	database           : DATABASE,
	multipleStatements : true,
	debug              : false
};

// var mysql = _mysql.createClient( dbConfig );

// mysql.query('use ' + DATABASE);

// var pool = _mysql.createPool( dbConfig );

// exports.pool = pool;

var connection = _mysql.createConnection( dbConfig );

connection.on('close', function(err) {
	if (err) {
		// Oops! Unexpected closing of connection, lets reconnect back.
		connection = _mysql.createConnection( dbConfig );
	} else {
		console.log('Connection closed normally.');
	}
});

// exports.connection = connection;
module.exports = connection;