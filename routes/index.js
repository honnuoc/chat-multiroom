var express   = require('express');
var router    = express.Router();
// var http      = require("http");
// var _socketio = require("socket.io");

// var app     = express(),
// 	server  = http.createServer(app),
// 	io      = _socketio.listen(server),
// 	sockets = io.sockets;

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

module.exports = function(sockets, connection) {

	/* GET home page. */
	router.index = function(req, res) {
		res.render('index', { title: 'Super Awesome Chatroom' });
	};

	// JSON API for list of celebrities
	router.list = function(req, res) {
		// var connection = req.app.locals.connection;

		connection.query('SELECT id, name, fan_page, facebook_id FROM celebrities LIMIT 0,10',
			function(error, celebrities) {
				if (error) {
					console.log('ERROR: ' + error);
					return;
				}
				res.json( { celebrities : celebrities } );
			}
		);
	};

	router.ioconnection = function(socket) {
		var sendStatus = function(s){
			socket.emit('status', s);
		};

		socket.on('adduser', function( data ) {
			socket.username = data.name;
			socket.room = data.room;
			participants[data.name] = data.name;
			socket.join(data.room);
			// console.log('user was added');
			// console.log(data.room);
			// console.log(data.name);
			socket.emit('updatechat', 'SERVER', 'you have connected to ' + data.room);
			socket.broadcast.to(data.room).emit('updatechat', 'SERVER', data.name + ' has connected to this room');
			socket.emit('updaterooms', rooms, data.room);
		});

		socket.on('create', function(room) {
			rooms.push(room);
			socket.emit('updaterooms', rooms, socket.room);
		});

		socket.on('sendchat', function(data) {
			var name = socket.username,
				message = data,
				whitespacePattern = /^\s*$/;

			if ( whitespacePattern.test(name) || whitespacePattern.test(message) ) {
				sendStatus("Name and message are required.");
			} else{
				var post  = { user_id: 3, celebrity_id: 8, content: data, created: '2014-10-30'};
				connection.query('INSERT INTO comments SET ?',
					post,
					function(error, result) {
						if (error) {
							console.log('ERROR: ' + error);
							return;
						}

						//Emit latest message to ALL clients in the same room
						sockets["in"](socket.room).emit('updatechat', name, message);

						sendStatus({
							message: "Message sent",
							clear: true
						});
					}
				);
			};
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
			sockets.emit('updateusers', participants);
			socket.broadcast.emit('updatechat', 'SERVER', socket.username + ' has disconnected');
			socket.leave(socket.room);
		});
	};

	return router;
}

// module.exports = router;