'use strict';

/* Directives */

angular.module('myApp.directives', []).
	directive('appVersion', function (version) {
		return function(scope, elm, attrs) {
			elm.text(version);
		};
	})
	.directive('ngEnter', function () {
		return function (scope, element, attrs) {
			element.bind("keydown keypress", function (event) {
				if( event.which === 13 && event.shiftKey === false ) {
					scope.$apply(function (){
						scope.$eval(attrs.ngEnter);
					});

					event.preventDefault();
				}
			});
		};
	});

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