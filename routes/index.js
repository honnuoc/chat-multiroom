var express = require('express');
var router  = express.Router();
var _mysql  = require('mysql');

/*
  The list of participants in our chatroom.
  The format of each participant will be:
  {
	id: "sessionId",
	name: "participantName"
  }
*/
var participants = [];

var rooms = [];

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

// JSON API for list of celebrities
router.list = function(req, res) {
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

router.ioconnection = function(socket) {
	socket.on('adduser', function(username) {
		socket.username = username;
		socket.room = 'Lobby';
		participants[username] = username;
		socket.join('Lobby');
		socket.emit('updatechat', 'SERVER', 'you have connected to Lobby');
		socket.broadcast.to('Lobby').emit('updatechat', 'SERVER', username + ' has connected to this room');
		socket.emit('updaterooms', rooms, 'Lobby');
	});

	socket.on('create', function(room) {
		rooms.push(room);
		socket.emit('updaterooms', rooms, socket.room);
	});

	socket.on('sendchat', function(data) {
		var post  = { user_id: 3, celebrity_id: 8, content: 'test comment with nodejs', created: '2014-10-30'};
		connection.query('INSERT INTO comments SET ?',
				post,
				function(error, result) {
				if (error) {
					console.log('ERROR: ' + error);
					return;
				}
				console.log('GENERATED id: ' + result.id);
			});
		socket["in"](socket.room).emit('updatechat', socket.username, data);
	});

	socket.on('switchRoom', function(newroom) {
		var oldroom;
		oldroom = socket.room;
		socket.leave(socket.room);
		socket.join(newroom);
		socket.emit('updatechat', 'SERVER', 'you have connected to ' + newroom);
		socket.broadcast.to(oldroom).emit('updatechat', 'SERVER', socket.username + ' has left this room');
		socket.room = newroom;
		socket.broadcast.to(newroom).emit('updatechat', 'SERVER', socket.username + ' has joined this room');
		socket.emit('updaterooms', rooms, newroom);
	});

	socket.on('disconnect', function() {
		delete participants[socket.username];
		socket.emit('updateusers', participants);
		socket.broadcast.emit('updatechat', 'SERVER', socket.username + ' has disconnected');
		socket.leave(socket.room);
	});
};

module.exports = router;