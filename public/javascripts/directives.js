'use strict';

/* Directives */

angular.module('myApp.directives', []).
	directive('appVersion', function (version) {
		return function(scope, element, attrs) {
			element.text(version);
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
	})
	.directive('pvScrolled', function() {
		return function(scope, element, attrs) {
			var raw = element[0];

			element.bind('scroll', function() {
				if (raw.scrollTop + raw.offsetHeight >= raw.scrollHeight) {
					scope.$apply(attrs.pvScrolled);
				}
			});
		};
	});
	// .directive("keepScroll", function(){

	// 	return {

	// 		controller : function($scope){
	// 			var element = null;

	// 			this.setElement = function(el){
	// 				element = el;
	// 			}

	// 			this.addItem = function(item){
	// 				console.log("Adding item", item, item.clientHeight);
	// 				element.scrollTop = ( element.scrollTop + item.clientHeight + 1 );
	// 				//1px for margin from your css (surely it would be possible
	// 				// to make it more generic, rather then hard-coding the value)
	// 			};

	// 		},

	// 		link : function(scope, el, attr, ctrl) {

	// 			ctrl.setElement(el[0]);

	// 		}
	// 	};
	// })
	// .directive('pvScrolled', function() {
	// 	return {
	// 		require : "^keepScroll",
	// 		controller : function(scope, element, attrs) {
	// 			console.info(element);
	// 			var raw = element[0];

	// 			element.bind('scroll', function() {
	// 				if (raw.scrollTop + raw.offsetHeight >= raw.scrollHeight) {
	// 					scope.$apply(attrs.pvScrolled);
	// 				}
	// 			});
	// 		}
	// 	};
	// });

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