'use strict';

/* Controllers */

angular.module('myApp.controllers', []).
	controller('ChatAppCtrl', ['$scope', 'ChatApp', 'socket', '$location', '$anchorScroll', function($scope, ChatApp, socket, $location, $anchorScroll) {
		$scope.name     = '';
		$scope.messages = '';
		$scope.area     = '';
		$scope.status   = '';

		var messagesNumber = 1;

		var getNode = function(s){
			return angular.element(document.querySelector(s));
		},

		//Get required nodes
		textarea      = getNode('.chat textarea'),
		messages      = getNode('.chat-messages'),
		chatName      = getNode('.chat-name'),
		status        = getNode('.chat-status span'),
		statusDefault = status.html(),

		setStatus = function(s){
			status.html(s);

			if ( s !== statusDefault ){
				var delay = setTimeout(function(){
					setStatus(statusDefault);
					clearInterval(delay);
				}, 3000);
			}
		};

		ChatApp.getCelebrities().then(function(data){
			$scope.title = data.data.title;
			$scope.celebrities = data.data.celebrities;
			$scope.selected = { value: data.data.celebrities[0].facebook_id };
		});

		angular.element(document).ready(function () {
			socket.on('connect', function(){
				var username = prompt( "What's your name: ", "Anonymous" );
				if ( username != null )
				{
					socket.emit('adduser', {  room: $scope.selected.value, name: username } );
				}
			});
		});

		//Listen for output
		socket.on('updatechat', function (data) {
			// messages.append('<b>'+ username + ':</b> ' + data + '<br>');

			if ( data instanceof Array && data.length )
			{
				messagesNumber = messages.children.length;

				// Loop through data
				for (var i = data.length - 1; i >= 0; i--) {
					var newMessage = angular.element('<div></div>');

					newMessage.addClass('chat-message');
					newMessage.attr('id', 'message' + messagesNumber);
					newMessage.html('<b>'+ data[i].name + ':</b> ' + data[i].message);

					messages.append(newMessage);

					messagesNumber ++;
				}
				messages[0].scrollTop = messages[0].scrollHeight;

				// set the location.hash to the id of
				// the element you wish to scroll to.
				// $location.hash('message' + (messagesNumber - 1));

				// call $anchorScroll()
				// $anchorScroll();
			}
			else if ( typeof data === 'object' )
			{
				messages.contents('');

				var newMessage = angular.element('<div></div>');

				newMessage.addClass('chat-message');
				newMessage.attr('id', 'message' + messagesNumber);
				newMessage.html('<b>'+ data.name + ':</b> ' + data.message);

				messages.append(newMessage);
			}
		});

		//Listen for status
		socket.on('status', function(data){
			setStatus((typeof data === 'object') ? data.message : data);

			if ( data.clear === true){
				$scope.area = '';
			}
		});
		// ChatApp.query(function(data) {
		// 	$scope.title = data.title;
		// 	$scope.celebrities = data.celebrities;
		// 	$scope.selected = { value: data[0].facebook_id };
		// });

		$scope.chatType = function(){
			var message = $scope.area;
			// $scope.area = '';

			socket.emit('sendchat', message);
		};

		$scope.switchRoom = function($event, facebookId){
			$scope.selected = { value: facebookId };

			if( facebookId ) {
				socket.emit('switchRoom', facebookId);
			} else {
				alert('You must select a room to enter');
			}
		};
	}]);