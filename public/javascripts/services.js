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
		var serviceBase = 'http://127.0.0.1:7070/'
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
		var serverPort = '7070';
		var socket = io.connect(serverBaseUrl + ':' + serverPort);
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
	.factory('CommentService', ['$http', function($http) {
		delete $http.defaults.headers.common['X-Requested-With'];

		var apiServerBaseUrl = "http://local.poundr.com/index.php?r=api";

		return {
			count: function(data) {
				var url = apiServerBaseUrl + "/getnumberofcommentsforapp&celebrity_id=" + data.celebrityId ;

				return $http.get(url).then(function (data) {
					var number = 0;
					if ( data.data.status !== undefined && data.data.status == 1 )
					{
						number = data.data.data.number;
					}
					return number;
				});
			},
			list: function(data) {
				var url = apiServerBaseUrl + "/getlistofcommentforapp&celebrity_id=" + data.celebrityId + "&offset=" + data.offset + "&limit=" + data.limit;
				return $http.get(url).then(function (data) {
					var results = [];
					if ( data.data.status !== undefined && data.data.status == 1 )
					{
						var items = data.data.data;
						for (var i = 0; i < items.length; i++) {
							var item = { id: items[i].id, name: items[i]['by_user'].first_name + ' ' + items[i]['by_user'].last_name, message: items[i].content, likes: items[i].like_number };
							results.push(item);
						}
					}
					return results;
				});
			}
		};
	}])
	.factory('FunctifyService', ['$http', function($http) {
		// delete $http.defaults.headers.common['X-Requested-With'];
		// $http.defaults.headers.post["Content-Type"] = "application/json";
		// $http.defaults.headers.post["Access-Control-Allow-Origin"] = "*";
		// $http.defaults.headers.post["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS, PUT, PATCH, DELETE";
		// $http.defaults.headers.post["Access-Control-Allow-Headers"] = "Origin, Content-Type, Accept";
		// $http.defaults.headers.post["Access-Control-Allow-Credentials"] = "true";

		var apiServerBaseUrl = "http://local.functify.com";

		return {
			// list: function(data) {
			// 	var url = apiServerBaseUrl + "/workout/list" + "?token=$2a$13$JUyM4YHvH1O3pd0jaDhSvp&goal=1&start=2014-10-17&amp;07:00:00&end=2014-11-17&amp;07:00:00" + "&jsonp=JSON_CALLBACK";
			// 	return $http.jsonp(url).success(function (data) {
			// 		console.info(data);
			// 	});
			// },
			list: function(data) {
				var url = apiServerBaseUrl + "/workout/list";
				return $http.post(url, { token: '$2a$13$deeEFfLQ/QBybFJ7qEWnwu', goal: '1', start: '2014-10-17 07:00:00', end: '2014-11-17 07:00:00'}).success(function (data) {
					console.info(data);
				});
			},
			login: function(data){
				var url = apiServerBaseUrl + "/auth/login";
				return $http.post(url, { email: data.email, password: data.password }).success(function (data) {
					console.info(data);
				});
			}
		};
	}])
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