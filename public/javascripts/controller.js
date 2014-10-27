'use strict';

/* Controllers */

angular.module('myApp.controllers', []).
	controller('ChatAppCtrl', ['$scope', 'ChatApp', 'socket', 'prompt', function($scope, ChatApp, socket, prompt) {

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

		ChatApp.getCelebrities().then(function(data){
			$scope.title = data.data.title;
			$scope.celebrities = data.data.celebrities;
			$scope.selected = { value: data.data.celebrities[0].facebook_id };
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
		// $scope.switchRoom = function($event, celebrityId){
		// 	$scope.selected = { value: celebrityId };
		// 	// console.info($scope.selected);

		// 	if(celebrityId) {
		// 		console.info(socket);
		// 		socket.emit('switchRoom', celebrityId);
		// 	} else {
		// 		alert('You must select a room to enter');
		// 	}
		// };
	}]);