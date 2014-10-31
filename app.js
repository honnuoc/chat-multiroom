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
var connection   = require('./db/database');

var app     = express(),
	server  = http.createServer(app),
	io      = _socketio.listen(server),
	sockets = io.sockets;

var routes = require('./routes/index.js')(sockets, connection);
// var users = require('./routes/users');

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

	console.log('connected as id ' + connection.threadId);
});

// Make our db accessible to our router
// app.use(function(req,res,next){
// 	req.connection = connection;
// 	next();
// });
// app.locals.connection = connection;

app.use(function(req, res, next) {
	// res.header("Access-Control-Allow-Origin", "*");
	// res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
	// res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	// next();

	// Website you wish to allow to connect
	res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8888');

	// Request methods you wish to allow
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

	// Request headers you wish to allow
	res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');

	// Set to true if you need the website to include cookies in the requests sent
	// to the API (e.g. in case you use sessions)
	res.setHeader('Access-Control-Allow-Credentials', true);

	// Pass to next layer of middleware
	next();
});

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

app.use(function(req, res, next) {
	if (req.url === '/favicon.ico') {
        res.writeHead(200, {'Content-Type': 'image/x-icon'} );
        res.end(/* icon content here */);
    } else {
        next();
    }
});

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