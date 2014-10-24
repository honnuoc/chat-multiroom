var _mysql       = require('mysql');

var HOST       = 'localhost';
var PORT       = 3306;
var MYSQL_USER = 'root';
var MYSQL_PASS = '';
var DATABASE   = 'poundr';
var TABLE      = '';

// var mysql = _mysql.createClient({
//     host: HOST,
//     port: PORT,
//     user: MYSQL_USER,
//     password: MYSQL_PASS,
// });

// mysql.query('use ' + DATABASE);

// var connection = _mysql.createConnection({
// 	host     : HOST,
// 	port     : PORT,
// 	user     : MYSQL_USER,
// 	password : MYSQL_PASS,
// 	database : DATABASE,
// 	debug    : true
// });

var pool = _mysql.createPool({
	host     : HOST,
	port     : PORT,
	user     : MYSQL_USER,
	password : MYSQL_PASS,
	database : DATABASE,
	debug    : true
});

exports.pool = pool;