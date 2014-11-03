'use strict';

/* Controllers */

angular.module('myApp.controllers', []).
	controller('ChatAppCtrl', ['$scope', '$http', 'ChatApp', 'socket', 'CommentService', 'FunctifyService', '$location', '$anchorScroll', function($scope, $http, ChatApp, socket, CommentService, FunctifyService, $location, $anchorScroll) {
		// delete $http.defaults.headers.common['X-Requested-With'];

		$scope.name     = '';
		$scope.messages = '';
		$scope.area     = '';
		$scope.status   = '';

		// var messagesNumber = 1;

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

		$scope.loadMoreComments = function () {
			if ( $scope.loadingResult ) {
				return;
			}
			if ( $scope.pagination.currentPage >= $scope.pagination.noOfPages ) {
				return;
			}
			$scope.pagination.currentPage = $scope.pagination.currentPage + 1;
			$scope.offset                 = ($scope.pagination.currentPage - 1) * $scope.pagination.pageSize;
			$scope.limit                  = $scope.pagination.pageSize;
			$scope.loadingResult          = true;
			CommentService.list({ celebrityId: $scope.celebrityId, offset: $scope.offset, limit: $scope.limit }).then(function(result){
				angular.forEach(result, function(value, key) {
					$scope.conversation.push(value);
				});
				messages[0].scrollTop = messages[0].scrollHeight - 20;
			});
			$scope.loadingResult          = false;
		};

		$scope.initializeResultList = function () {
			$scope.pagination = {
				noOfPages   : 1,
				currentPage : 0,
				pageSize    : 10
			};

			CommentService.count({ celebrityId: $scope.celebrityId }).then(function (count) {
				$scope.total = count;
				$scope.pagination.noOfPages = Math.ceil( count / $scope.pagination.pageSize );
				$scope.loadMoreComments();
			});
		}

		ChatApp.getCelebrities().then(function(data){
			$scope.title       = data.data.title;
			$scope.celebrities = data.data.celebrities;
			$scope.selected    = { value: data.data.celebrities[0].facebook_id };
		});

		angular.element(document).ready(function () {

			$scope.conversation = [];

			socket.on('connect', function(){
				var username = prompt( "What's your name: ", "Anonymous" );
				if ( username != null )
				{
					socket.emit('adduser', {  room: $scope.selected.value, name: username } );
				}
			});
		});

		//Listen for update room
		socket.on('updatecurrentroom', function (data) {
			if ( typeof data === 'object' )
			{
				$scope.celebrityId = data.room.id;
				// $scope.initializeResultList();
				$scope.pagination = {
					noOfPages   : 1,
					currentPage : 1,
					pageSize    : 10
				};

				$scope.total = data.number_of_cm;
				$scope.pagination.noOfPages = Math.ceil( $scope.total / $scope.pagination.pageSize );
			}
		});

		// FunctifyService.login({ email: 'honnuoc@gmail.com', password: '123'});
		// FunctifyService.list();
		// var url = "http://local.functify.com" + "/workout/list";
		// $http.post(
		// 	url,
		// 	{ token: '$2a$13$JUyM4YHvH1O3pd0jaDhSvp', goal: '1', start: '2014-10-17 07:00:00', end: '2014-11-17 07:00:00', jsonp: 'JSON_CALLBACK' }
		// 	// { "headers" : {
		// 	// 		"Content-Type" : "application/json; charset=UTF-8",
		// 	// 		"Access-Control-Allow-Origin" : "*",
		// 	// 		"Access-Control-Allow-Methods" : "GET, POST, OPTIONS, PUT, PATCH, DELETE",
		// 	// 		"Access-Control-Allow-Headers" : "Origin, X-Requested-With, Content-Type, Accept",
		// 	// 		"Access-Control-Allow-Credentials" : true
		// 	// 	}
		// 	// }
		// ).success(function (data) {
		// 	console.info(data);
		// });

		//Listen for output
		socket.on('updatechat', function (data) {
			// messages.append('<b>'+ username + ':</b> ' + data + '<br>');

			if ( data instanceof Array )
			{
				// messagesNumber = messages.children.length;

				// Loop through data
				for (var i = 0; i < data.length; i ++) {
					// var newMessage = angular.element('<div></div>');

					// newMessage.addClass('chat-message');
					// newMessage.attr('id', 'message' + messagesNumber);
					// newMessage.html('<b>'+ data[i].name + ':</b> ' + data[i].message);

					// messages.append(newMessage);

					// messagesNumber ++;

					var item = { id: data[i].id, name: data[i].name, message: data[i].message, likes: data[i].likes };
					$scope.conversation.push(item);
				}
				// messages[0].scrollTop = messages[0].scrollHeight;
				// messages[0].scrollTop = 0;

				// set the location.hash to the id of
				// the element you wish to scroll to.
				// $location.hash('message' + (messagesNumber - 1));

				// call $anchorScroll()
				// $anchorScroll();
			}
			else if ( typeof data === 'object' )
			{
				// messages.empty();

				// var newMessage = angular.element('<div></div>');

				// newMessage.addClass('chat-message');
				// newMessage.attr('id', 'message' + messagesNumber);
				// newMessage.html('<b>'+ data.name + ':</b> ' + data.message);

				// messages.append(newMessage);

				// $scope.conversation = [];
				var item = { id: data.id, name: data.name, message: data.message, likes: data.likes };
				$scope.conversation.unshift(item);
			}
		});

		//Listen for update 'like'
		socket.on('updatelike', function (data) {
			if ( typeof data === 'object' )
			{
				angular.forEach($scope.conversation, function(value, key) {
					if (value.id == data.id) {
						value.likes = data.likes;
					}
				});
			}
		});

		//Listen for status
		socket.on('status', function(data){
			setStatus((typeof data === 'object') ? data.message : data);

			if ( data.clear === true){
				$scope.area = '';
				// textarea  = '';
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
			$scope.conversation = [];

			if( facebookId ) {
				socket.emit('switchRoom', facebookId);
			} else {
				alert('You must select a room to enter');
			}
		};

		$scope.loveIt = function($event, commentId){
			if( commentId ) {
				socket.emit('loveIt', commentId);
			} else {
				alert('You must click on a comment which you love');
			}
		};
	}]);