'use strict';

/* Controllers */

angular.module('myApp.controllers', []).
	controller('ChatAppCtrl', ['$scope', 'ChatApp', 'socket', 'prompt', function($scope, ChatApp, socket, prompt) {
		var _name    = '';
		var _message = '';
		var _area    = '';
		var _status  = '';
		$scope.chat = {
			name: function (newName) {
				if (angular.isDefined(newName)) {
					_name = newName;
				}
				return _name;
		  	},
		  	messages: function (newMessage) {
				if (angular.isDefined(newMessage)) {
					_message = newMessage;
				}
				return _message;
		  	},
		  	area: function (newArea) {
				if (angular.isDefined(newArea)) {
					_area = newArea;
				}
				return _area;
		  	},
		  	status: function (newStatus) {
				if (angular.isDefined(newStatus)) {
					_status = newStatus;
				}
				return _status;
		  	}
		};

		ChatApp.getCelebrities().then(function(data){
			$scope.title = data.data.title;
			$scope.celebrities = data.data.celebrities;
			$scope.selected = { value: data.data.celebrities[0].facebook_id };
		});

		angular.element(document).ready(function () {
			console.log('Hello World');
			socket.on('connect', function(){
				console.info('co vo ');
				console.info($scope.selected.value);
				socket.emit('adduser', {  room: $scope.selected.value, name:
					// Use new, injected prompt.
					prompt( "What's your name: ", "Anonymous" ).then(
						function( response ) {

							console.log( "Prompt accomplished with", response );
							return response;

						},
						function() {

							console.log( "Prompt failed :(" );

						}
					)}
				);
			});
		});

		socket.on('updatechat', function (username, data) {
			console.log(username);
			console.log(data);
			// messages.append('<b>'+ username + ':</b> ' + data + '<br>');
		});
		// ChatApp.get(function(data) {
		// 	$scope.title = data.title;
		// 	$scope.celebrities = data.celebrities;
		// 	$scope.selected = { value: data[0].facebook_id };
		// 	// console.log($scope.selected);
		// });

		$scope.chatType = function($event){
			console.log('keydown');
			// var element = angular.element(document.querySelector('#data'));
			// var message = element.value;
			// element.value = '';
			// socket.emit('sendchat', message);
			// var self = this,
			// 	name = chatName.value;

			// if ( event.which === 13 && event.shiftKey === false ){
			// 	socket.emit('input', {
			// 		name: name,
			// 		message: self.value
			// 	});

			// 	event.preventDefault();
			// }
		};

		$scope.switchRoom = function($event, celebrityId){
			$scope.selected = { value: celebrityId };
			// console.info($scope.selected);

			if(celebrityId) {
				console.info(socket);
				socket.emit('switchRoom', celebrityId);
			} else {
				alert('You must select a room to enter');
			}
		};
	}]);