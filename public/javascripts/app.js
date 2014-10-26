angular.module('chatApp',
	[
		'chatAppServices'
	]
	).
	config(['$routeProvider', function($routeProvider) {
		$routeProvider.
			when('/celebrities', { templateUrl: 'partials/index.html', controller:ChatAppCtrl }).
			// when('/celebrities/:celebrityId', { templateUrl: 'partials/index.html', controller:ChatAppCtrl }).
			otherwise({ redirectTo: '/celebrities' });
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