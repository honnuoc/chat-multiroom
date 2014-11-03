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

var host      = 'local.poundr.com/index.php?r=';
// var username  = '';
// var password  = '*****';
// var apiKey    = '*****';
// var sessionId = null;
// var deckId    = '*****-***-***-***-*****';

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

			var userId        = connection.escape(data.name);
			var sql_user      = 'SELECT * FROM users WHERE id = ' + userId;
			var fbId          = connection.escape(data.room);
			var sql_celebrity = 'SELECT * FROM celebrities WHERE facebook_id = ' + fbId;
			var sql_comment   = ' \
						SELECT comments.id, users.first_name, users.last_name, comments.content, comments.like_number \
						FROM comments \
						INNER JOIN users ON comments.user_id = users.id \
						INNER JOIN celebrities ON comments.celebrity_id = celebrities.id \
						WHERE celebrities.facebook_id = ' + fbId + ' \
						ORDER BY comments.created DESC \
						LIMIT 0, 10';
			var sql_count_comment   = ' \
						SELECT COUNT(*) AS cn \
						FROM comments \
						INNER JOIN celebrities ON comments.celebrity_id = celebrities.id \
						WHERE celebrities.facebook_id = ' + fbId ;
			connection.query(sql_user + '; ' + sql_celebrity + '; ' + sql_count_comment + '; ' + sql_comment,
				function(error, results) {
					if (error) {
						console.log('ERROR: ' + error);
						return;
					}

					// console.log(results[0]); // [{1: 1}]
					// console.log(results[1]); // [{2: 2}]
					// console.log(results[2]); // [{2: 2}]
					// console.log(results[3]); // [{2: 2}]

					if ( results[0].length > 0 && results[1].length > 0 )
					{
						//Store the celebrity's info - room & the user's info
						var user = { id: results[0][0]['id'], name: results[0][0]['first_name'] + ' ' + results[0][0]['last_name'] };
						socket.user = user;
						var room = { id: results[1][0]['id'], fb_id: fbId, name: results[1][0]['name'] };
						socket.room = room;

						participants[socket.user.name] = socket.user.name;
						socket.join(socket.room.fb_id);

						socket.emit('updatechat', { id: null, name: 'SERVER', message: 'you have connected to ' + socket.room.name, likes: 100 });

						//Emit ALL messages to client
						var data = [];

						if ( results[2].length > 0 && results[3].length > 0 )
						{
							for (var i = 0; i < results[3].length; i++) {
								var item        = {};
								item['id']      = results[3][i]['id'];
								item['name']    = results[3][i]['first_name'] + ' ' + results[3][i]['last_name'];
								item['message'] = results[3][i]['content'];
								item['likes']   = results[3][i]['like_number'];

								data.push(item);
							};
						}
						socket.emit('updatecurrentroom', { room: socket.room, number_of_cm: results[2][0].cn } );
						socket.emit('updatechat', data);

						socket.broadcast.to(socket.room.fb_id).emit('updatechat', { id: null, name: 'SERVER', message: socket.user.name + ' has connected to this room', likes: 100 });
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
							var data = { id: result.insertId, name: name, message: message, likes: 0 };
							sockets["in"](socket.room.fb_id).emit('updatechat', data);

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
			var fbId          = connection.escape(newFacebookId);
			var sql_celebrity = 'SELECT * FROM celebrities WHERE facebook_id = ' + fbId;
			var sql_comment   = ' \
						SELECT comments.id, users.first_name, users.last_name, comments.content, comments.like_number \
						FROM comments \
						INNER JOIN users ON comments.user_id = users.id \
						INNER JOIN celebrities ON comments.celebrity_id = celebrities.id \
						WHERE celebrities.facebook_id = ' + fbId + ' \
						ORDER BY comments.created DESC \
						LIMIT 0, 10';
			var sql_count_comment   = ' \
						SELECT COUNT(*) AS cn \
						FROM comments \
						INNER JOIN celebrities ON comments.celebrity_id = celebrities.id \
						WHERE celebrities.facebook_id = ' + fbId ;
			connection.query(sql_celebrity + '; ' + sql_count_comment + '; ' + sql_comment,
				function(error, results) {
					if (error) {
						console.log('ERROR: ' + error);
						return;
					}

					if ( results[0].length > 0 )
					{
						//Create the NEW celebrity's info - room
						var newroom = { id: results[0][0]['id'], fb_id: fbId, name: results[0][0]['name'] };

						var oldroom;
						oldroom = socket.room;
						socket.leave(socket.room.fb_id);
						socket.join(newroom.fb_id);
						socket.emit('updatechat', { id: null, name: 'SERVER', message: 'you have connected to ' + newroom.name, likes: 100 });

						socket.broadcast.to(oldroom.fb_id).emit('updatechat', { id: null, name: 'SERVER', message: socket.user.name + ' has left this room', likes: 100 });
						socket.room = newroom;

						//Emit ALL messages to client
						var data = [];

						if ( results[1].length > 0 && results[2].length > 0 )
						{
							for (var i = 0; i < results[2].length; i++) {
								var item        = {};
								item['id']      = results[2][i]['id'];
								item['name']    = results[2][i]['first_name'] + ' ' + results[2][i]['last_name'];
								item['message'] = results[2][i]['content'];
								item['likes']   = results[2][i]['like_number'];

								data.push(item);
							};
						}
						socket.emit('updatecurrentroom', { room: socket.room, number_of_cm: results[1][0].cn } );
						socket.emit('updatechat', data);

						socket.broadcast.to(newroom.fb_id).emit('updatechat', { id: null, name: 'SERVER', message: socket.user.name + ' has joined this room', likes: 100 });
					}
				}
			);
		});

		socket.on('loveIt', function(commentId) {
			if ( socket.user !== undefined )
			{
				var cmId                = connection.escape(commentId);
				var sql_r_like_cm_users = "SELECT * FROM like_comment_users WHERE user_id = " + socket.user.id + " AND comment_id = " + cmId + " ORDER BY comment_id LIMIT 1";
				var sql_u_cm            = 'UPDATE comments SET like_number = like_number + 1 WHERE id = ' + cmId;
				var sql_c_like_cm_users = 'INSERT INTO like_comment_users SET ?';
				var sql_r_cm            = 'SELECT * FROM comments WHERE id = ' + cmId;
				var post                = { user_id: socket.user.id, comment_id: cmId, created: new Date()};

				connection.query(sql_r_like_cm_users,
					function (error, results, fields) {
						if (error) {
							console.log(error);
							sendStatus("Fail internal error");
						}

						if ( results.length > 0 ) {
							console.log('fail');
							sendStatus("You has already liked this comment");
						} else {

							connection.query(sql_c_like_cm_users + '; ' + sql_u_cm + '; ' + sql_r_cm,
								post,
								function(error, results) {
									if (error) {
										console.log('ERROR: ' + error);
										return;
									}

									if ( results[2].length > 0 )
									{
										//Return the comment's info
										var cm = { id: results[2][0]['id'], likes: results[2][0]['like_number'] };
										sockets["in"](socket.room.fb_id).emit('updatelike', cm );
									}
								}
							);
						}
					}
				);
			}
		});

		socket.on('disconnect', function() {
			if ( socket.user !== undefined )
			{
				delete participants[socket.user.name];
				sockets.emit('updateusers', participants);
				socket.broadcast.emit('updatechat', { id: null, name: 'SERVER', message: socket.user.name + ' has disconnected', likes: 100 });
				socket.leave(socket.room.fb_id);
			}
		});
	};

	return router;
}

// module.exports = router;