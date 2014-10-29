var express   = require('express');
var router    = express.Router();

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

			var userId        = data.name;
			var sql_user      = 'SELECT * FROM users WHERE id = ' + connection.escape(userId);
			var fbId          = data.room;
			var sql_celebrity = 'SELECT * FROM celebrities WHERE facebook_id = ' + connection.escape(fbId);
			var sql_comment   = 'SELECT * FROM comments INNER JOIN users ON comments.user_id = users.id INNER JOIN celebrities ON comments.celebrity_id = celebrities.id WHERE celebrities.facebook_id = ' + connection.escape(fbId);
			connection.query(sql_user + '; ' + sql_celebrity + '; ' + sql_comment,
				function(error, results) {
					if (error) {
						console.log('ERROR: ' + error);
						return;
					}

					// console.log(results[0]); // [{1: 1}]
					// console.log(results[1]); // [{2: 2}]
					// console.log(results[2]); // [{2: 2}]

					if ( results[0].length > 0 && results[1].length > 0 )
					{
						//Store the celebrity's info - room & the user's info
						var user = { id: userId, name: results[0][0]['first_name'] + ' ' + results[0][0]['last_name'] };
						socket.user = user;
						var room = { id: results[1][0]['id'], fb_id: fbId, name: results[1][0]['name'] };
						socket.room = room;

						participants[socket.user.name] = socket.user.name;
						socket.join(socket.room.fb_id);

						socket.emit('updatechat', { name: 'SERVER', message: 'you have connected to ' + socket.room.name });

						//Emit ALL messages to client
						var data = [];

						if ( results[2].length > 0 )
						{
							for (var i = 0; i < results[2].length; i++) {
								var item        = {};
								item['name']    = results[2][i]['first_name'] + ' ' + results[2][i]['last_name'];
								item['message'] = results[2][i]['content'];

								data.push(item);
							};
						}
						socket.emit('updatechat', data);

						socket.broadcast.to(socket.room.fb_id).emit('updatechat', [{ name: 'SERVER', message: socket.user.name + ' has connected to this room' }]);
						// socket.emit('updaterooms', rooms, socket.room);
					}
				}
			);
		});

		// socket.on('create', function(room) {
		// 	rooms.push(room);
		// 	socket.emit('updaterooms', rooms, socket.room);
		// });

		socket.on('sendchat', function(message) {
			if ( socket.user !== undefined )
			{
				var name = socket.user.name,
					message = message,
					whitespacePattern = /^\s*$/;

				if ( whitespacePattern.test(message) ) {
					sendStatus("Message is required.");
				} else{
					var post  = { user_id: socket.user.id, celebrity_id: socket.room.id, content: message, created: new Date()};
					connection.query('INSERT INTO comments SET ?',
						post,
						function(error, result) {
							if (error) {
								console.log('ERROR: ' + error);
								return;
							}

							//Emit latest message to ALL clients in the same room
							var data = { name: name, message: message };
							sockets["in"](socket.room.fb_id).emit('updatechat', [data]);

							sendStatus({
								message: "Message sent",
								clear: true
							});
						}
					);
				};
			}
			else{
				sendStatus("User is required.");
			}
		});

		socket.on('switchRoom', function(newFacebookId) {
			var fbId          = newFacebookId;
			var sql_celebrity = 'SELECT * FROM celebrities WHERE facebook_id = ' + connection.escape(fbId);
			connection.query(sql_celebrity,
				function(error, results) {
					if (error) {
						console.log('ERROR: ' + error);
						return;
					}

					//Create the NEW celebrity's info - room
					var newroom = { id: results[0]['id'], fb_id: fbId, name: results[0]['name'] };

					var oldroom;
					oldroom = socket.room;
					socket.leave(socket.room.fb_id);
					socket.join(newroom.fb_id);
					socket.emit('updatechat', [{ name: 'SERVER', message: 'you have connected to ' + newroom.name }]);
					socket.broadcast.to(oldroom.fb_id).emit('updatechat', [{ name: 'SERVER', message: socket.user.name + ' has left this room' }]);
					socket.room = newroom;
					socket.broadcast.to(newroom.fb_id).emit('updatechat', [{ name: 'SERVER', message: socket.user.name + ' has joined this room' }]);
					// socket.emit('updaterooms', rooms, newroom);
				}
			);
		});

		socket.on('disconnect', function() {
			if ( socket.user !== undefined )
			{
				delete participants[socket.user.name];
				sockets.emit('updateusers', participants);
				socket.broadcast.emit('updatechat', [{ name: 'SERVER', message: socket.user.name + ' has disconnected' }]);
				socket.leave(socket.room.fb_id);
			}
		});
	};

	return router;
}

// module.exports = router;