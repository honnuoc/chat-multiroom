var serverBaseUrl = document.domain;

/*
	On client init, try to connect to the socket.IO server.
	Note we don't specify a port since we set up our server
	to run on port 8080
*/
// var socket = io.connect(serverBaseUrl);

var socket = io.connect('http://127.0.0.1:7070');




// socket.on('updaterooms', function (rooms, current_room) {
//     $('#rooms').empty();
//     $.each(rooms, function(key, value) {
//         if(value == current_room){
//             $('#rooms').append('<div>' + value + '</div>');
//         }
//         else {
//             $('#rooms').append('<div><a href="#" onclick="switchRoom(\''+value+'\')">' + value + '</a></div>');
//         }
//     });
// });

// function switchRoom(room){
//     socket.emit('switchRoom', room);
// }

// $(document).ready(function () {
//     angular.bootstrap(document, ["chatApp"]);
// });


angular.element(document).ready(function(){

	var getNode = function(s){
		return angular.element(document.querySelector(s));
	},

	//Get required nodes
	textarea      = getNode('.chat textarea'),
	messages      = getNode('.chat-messages'),
	chatName      = getNode('.chat-name'),
	status        = getNode('.chat-status span'),
	current_room  = getNode('.current_room'),
	statusDefault = status.textContent,

	setStatus = function(s){
		status.textContent = s;

		if ( s !== statusDefault ){
			var delay = setTimeout(function(){
				setStatus(statusDefault);
				clearInterval(delay);
			}, 3000);
		}
	};

	// socket.on('connect', function(){
	// 	console.info(current_room);
	//     socket.emit('adduser', prompt("What's your name: "), current_room.value );
	// });

	// socket.on('updatechat', function (username, data) {
	// 	console.log(username);
	// 	console.log(data);
	//     messages.append('<b>'+ username + ':</b> ' + data + '<br>');
	// });

	//Listen for keydown
	// textarea.addEventListener('keydown', function(event){
	// 	var self = this,
	// 		name = chatName.value;

	// 	if ( event.which === 13 && event.shiftKey === false ){
	// 		socket.emit('input', {
	// 			name: name,
	// 			message: self.value
	// 		});

	// 		event.preventDefault();
	// 	}

	// });
    // $('#datasend').click( function() {
    //     var message = $('#data').val();
    //     $('#data').val('');
    //     socket.emit('sendchat', message);
    // });

    // $('#data').keypress(function(e) {
    //     if(e.which == 13) {
    //         $(this).blur();
    //         $('#datasend').focus().click();
    //     }
    // });

    // $('#roombutton').click(function(){
    //     var name = $('#roomname').val();
    //     $('#roomname').val('');
    //     socket.emit('create', name)
    // });
});