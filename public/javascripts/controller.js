'use strict';

/* Controllers */

angular.module('myApp.controllers', []).
	controller('ChatAppCtrl', ['$scope', 'ChatApp', 'socket', function($scope, ChatApp, socket) {
		$scope.name     = '';
		$scope.messages = '';
		$scope.area     = '';
		$scope.status   = '';

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
		socket.on('updatechat', function (username, data) {
			messages.append('<b>'+ username + ':</b> ' + data + '<br>');
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

		$scope.switchRoom = function($event, celebrityId){
			$scope.selected = { value: celebrityId };

			if(celebrityId) {
				socket.emit('switchRoom', celebrityId);
			} else {
				alert('You must select a room to enter');
			}
		};
	}]);