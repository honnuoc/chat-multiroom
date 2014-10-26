/*
  Module dependencies:

  - Express
  - Http (to run Express)
  - Body parser (to parse JSON requests)
  - Underscore (because it's cool)
  - Socket.IO(Note: we need a web server to attach Socket.IO to)

  It is a common practice to name the variables after the module name.
  Ex: http is the "http" module, express is the "express" module, etc.
  The only exception is Underscore, where we use, conveniently, an
  underscore. Oh, and "socket.io" is simply called io. Seriously, the
  rest should be named after its module name.

*/
var express      = require('express');
var http         = require("http");
var _socketio    = require("socket.io");
var path         = require('path');
var favicon      = require('serve-favicon');
var logger       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var _            = require("underscore");
var querystring  = require('querystring');
var https        = require('https');
var _mysql       = require('mysql');

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

// var mysql = _mysql.createClient({
//     host: HOST,
//     port: PORT,
//     user: MYSQL_USER,
//     password: MYSQL_PASS,
// });

// mysql.query('use ' + DATABASE);

var connection = _mysql.createConnection( dbConfig );

// var pool = _mysql.createPool({
// 	host     : HOST,
// 	port     : PORT,
// 	user     : MYSQL_USER,
// 	password : MYSQL_PASS,
// 	database : DATABASE,
// 	debug    : true
// });

var routes = require('./routes/index');
// var users = require('./routes/users');

var app     = express(),
	server  = http.createServer(app),
	io      = _socketio.listen(server),
	sockets = io.sockets;

var host      = 'www.thegamecrafter.com';
var username  = 'JonBob';
var password  = '*****';
var apiKey    = '*****';
var sessionId = null;
var deckId    = '68DC5A20-EE4F-11E2-A00C-0858C0D5C2ED';

function performRequest(endpoint, method, data, success) {
	var dataString = JSON.stringify(data);
	var headers = {};

	if (method == 'GET') {
		endpoint += '?' + querystring.stringify(data);
	}
	else {
		headers = {
			'Content-Type': 'application/json',
			'Content-Length': dataString.length
		};
	}
	var options = {
		host: host,
		path: endpoint,
		method: method,
		headers: headers
	};

	var req = https.request(options, function(res) {
		res.setEncoding('utf-8');

		var responseString = '';

		res.on('data', function(data) {
			responseString += data;
		});

		res.on('end', function() {
			console.log(responseString);
			var responseObject = JSON.parse(responseString);
			success(responseObject);
		});
	});

	req.write(dataString);
	req.end();
}

//Server's IP address
app.set("ipaddr", "127.0.0.1");

//Server's port number
app.set("port", 7070);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// app.get("/", function(request, response) {

//   //Show a simple response message
//   // response.send("Server is up and running");

//   //Render the view called "index"
//   response.render("index", { title: 'Super Awesome Chatroom' });

// });

app.get('/', routes.index);
app.get('/celebrities', routes.list);
// app.get('/celebrities/:currentId', routes.list);

// io.set('match origin protocol', true);
// io.set('origins', '*:*');

connection.connect(function(err) {
	if ( !err ) {
		console.log("Connected to MySQL");
	} else {
		console.error('Error Connecting: ' + err.stack);
		return;
	}

	// connection.query('SELECT facebook_id FROM celebrities',
	// 	function(error, celebrities) {
	// 		if (error) {
	// 			console.log('ERROR: ' + error);
	// 			return;
	// 		}
	// 		for(var i = 0; i < celebrities.length; i ++)
	// 		{
	// 			rooms[i] = celebrities[i].facebook_id;
	// 		}
	// 		console.log(rooms);
	// 	}
	// );

	sockets.on('connection', routes.ioconnection);

	// sockets.on('connection', function(socket) {
	// 	socket.on('adduser', function(username) {
	// 		socket.username = username;
	// 		socket.room = 'Lobby';
	// 		participants[username] = username;
	// 		socket.join('Lobby');
	// 		socket.emit('updatechat', 'SERVER', 'you have connected to Lobby');
	// 		socket.broadcast.to('Lobby').emit('updatechat', 'SERVER', username + ' has connected to this room');
	// 		socket.emit('updaterooms', rooms, 'Lobby');
	// 	});

	// 	socket.on('create', function(room) {
	// 		rooms.push(room);
	// 		socket.emit('updaterooms', rooms, socket.room);
	// 	});

	// 	socket.on('sendchat', function(data) {
	// 		var post  = { user_id: 3, celebrity_id: 8, content: 'test comment with nodejs', created: '2014-10-30'};
	// 		connection.query('INSERT INTO comments SET ?',
	// 				post,
	// 				function(error, result) {
	// 				if (error) {
	// 					console.log('ERROR: ' + error);
	// 					return;
	// 				}
	// 				console.log('GENERATED id: ' + result.id);
	// 			});
	// 		sockets["in"](socket.room).emit('updatechat', socket.username, data);
	// 	});

	// 	socket.on('switchRoom', function(newroom) {
	// 		var oldroom;
	// 		oldroom = socket.room;
	// 		socket.leave(socket.room);
	// 		socket.join(newroom);
	// 		socket.emit('updatechat', 'SERVER', 'you have connected to ' + newroom);
	// 		socket.broadcast.to(oldroom).emit('updatechat', 'SERVER', socket.username + ' has left this room');
	// 		socket.room = newroom;
	// 		socket.broadcast.to(newroom).emit('updatechat', 'SERVER', socket.username + ' has joined this room');
	// 		socket.emit('updaterooms', rooms, newroom);
	// 	});

	// 	socket.on('disconnect', function() {
	// 		delete participants[socket.username];
	// 		sockets.emit('updateusers', participants);
	// 		socket.broadcast.emit('updatechat', 'SERVER', socket.username + ' has disconnected');
	// 		socket.leave(socket.room);
	// 	});
	// });

	console.log('connected as id ' + connection.threadId);
});

// Make our db accessible to our router
// app.use(function(req,res,next){
// 	req.connection = connection;
// 	next();
// });

app.use('/', routes);
// app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
	app.use(function(err, req, res, next) {
		res.status(err.status || 500);
		res.render('error', {
			message: err.message,
			error: err
		});
	});
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
	res.status(err.status || 500);
	res.render('error', {
		message: err.message,
		error: {}
	});
});

//Start the http server at port and IP defined before
server.listen(app.get("port"), app.get("ipaddr"), function() {
	console.log("Server up and running. Go to http://" + app.get("ipaddr") + ":" + app.get("port"));
});

module.exports = app;
