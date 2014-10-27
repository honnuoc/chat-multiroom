'use strict';

// Declare app level module which depends on filters, and services

var myApp = angular.module('chatApp',
	[
		'myApp.controllers',
		'myApp.filters',
		'myApp.services',
		'myApp.directives',
	]);

myApp.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
		$routeProvider.
			when('/', { templateUrl: 'partials/index.html', controller: "ChatAppCtrl" }).
			otherwise({ redirectTo: '/' });

		// configure html5 to get links working
		// If you don't do this, you URLs will be base.com/#/home rather than base.com/home
		$locationProvider.html5Mode(true);
	}]);

	// .directive('chatTextArea', function() {
	// 	var linkFn = function(scope, element, attrs) {

	// 		var div = element.find('div');
	// 		var textarea = element.find('textarea');
	// 		var input = element.find('input');

	// 		textarea.bind("keydown", function(event) {
	// 			scope.$apply();

	// 			var self = this,
	// 				name = input.value;

	// 			if ( event.which === 13 && event.shiftKey === false ){
	// 				socket.emit('input', {
	// 					name: name,
	// 					message: self.value
	// 				});

	// 				event.preventDefault();
	// 			}
	// 		});
	// 	};
	// 	return {
	// 		link: linkFn,
	// 		restrict: 'AE',
	// 		scope: true,
	// 		template: '<input type="text" class="chat-name" placeholder="Enter your name" /><div class="chat-messages"></div><textarea placeholder="Type your message"></textarea>',
	// 		transclude: false
	// 	};
	// });