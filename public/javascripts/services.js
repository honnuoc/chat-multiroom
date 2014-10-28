'use strict';

/* Services */
angular.module('CacheService', ['ng'])
	.factory('CacheService', function($cacheFactory) {
		return $cacheFactory('CacheService');
	});

angular.module('myApp.services', ['ngResource']).
	factory('ChatApp', ['$http', function($http) {
		// return $resource('/celebrities/:celebrityId/', { celebrityId: '@celebrityId'}, {
		// 	query: { method: 'GET', params: { celebrityId: '@celebrityId' }, isArray: true }
		// });
		var serviceBase = 'http://localhost:7070/'
		var obj = {};
		obj.getCelebrities = function(){
			return $http.get(serviceBase + 'celebrities');
		}
		// obj.getCustomers = function(){
		// 	return $http.get(serviceBase + 'customers');
		// }
		// obj.getCustomer = function(customerID){
		// 	return $http.get(serviceBase + 'customer?id=' + customerID);
		// }

		// obj.insertCustomer = function (customer) {
		// 	return $http.post(serviceBase + 'insertCustomer', customer).then(function (results) {
		// 		return results;
		// 	});
		// };

		// obj.updateCustomer = function (id,customer) {
		// 	return $http.post(serviceBase + 'updateCustomer', {id:id, customer:customer}).then(function (status) {
		// 		return status.data;
		// 	});
		// };

		// obj.deleteCustomer = function (id) {
		// 	return $http.delete(serviceBase + 'deleteCustomer?id=' + id).then(function (status) {
		// 		return status.data;
		// 	});
		// };

		return obj;
	}])
	.factory('socket', function($rootScope) {
		var serverBaseUrl = document.domain;
		var socket = io.connect(serverBaseUrl);
		// var socket = io.connect('http://localhost:7070/');
		return {
			on: function (eventName, callback) {
				socket.on(eventName, function () {
					var args = arguments;
					$rootScope.$apply(function () {
						callback.apply(socket, args);
					});
				});
			},
			emit: function (eventName, data, callback) {
				socket.emit(eventName, data, function () {
					var args = arguments;
					$rootScope.$apply(function () {
						if (callback) {
							callback.apply(socket, args);
						}
					});
				});
			},
			send: function(eventName, data, callback) {
				socket.send(eventName, data, function() {
					var args = arguments;
					$rootScope.$apply(function() {
						if (callback) {
							callback.apply(socket, args);
						}
					});
				});
			}
		};
	})
	.factory("prompt",
		function( $window, $q ) {

			// Define promise-based prompt() method.
			function prompt( message, defaultValue ) {

				var defer = $q.defer();

				// The native prompt will return null or a string.
				var response = $window.prompt( message, defaultValue );

				if ( response === null ) {

					defer.reject();

				} else {

					defer.resolve( response );

				}

				return( defer.promise );

			}

			return( prompt );

		}
	)
	// I define an asynchronous wrapper to the native alert() method. It returns a
	// promise that will be resolved in a future tick of the event loop.
	// --
	// NOTE: This promise will never be "rejected" since there is no divergent
	// behavior available to the user with the alert() method.
	.factory("alert",
		function( $window, $q ) {

			// Define promise-based alert() method.
			function alert( message ) {

				var defer = $q.defer();

				$window.alert( message );

				defer.resolve();

				return( defer.promise );

			}

			return( alert );

		}
	)
	// I define an asynchronous wrapper to the native confirm() method. It returns a
	// promise that will be "resolved" if the user agrees to the confirmation; or
	// will be "rejected" if the user cancels the confirmation.
	.factory(
		"confirm",
		function( $window, $q ) {

			// Define promise-based confirm() method.
			function confirm( message ) {

				var defer = $q.defer();

				// The native confirm will return a boolean.
				if ( $window.confirm( message ) ) {

					defer.resolve( true );

				} else {

					defer.reject( false );

				}

				return( defer.promise );

			}

			return( confirm );

		}
	)
	.factory('HackerNewsService', function(CacheService) {
		return {
			getNews: function(key) {
				var news = CacheService.get(key);

				if(news) {
					return news;
				}

				return null;
			},
			setNews: function(key, value) {
				CacheService.put(key, value);
			},
			clearNews: function(key) {
				CacheService.put(key, '');
			}
		};
	});