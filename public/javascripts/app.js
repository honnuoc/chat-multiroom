'use strict';

// Declare app level module which depends on filters, and services

var myApp = angular.module('chatApp',
	[
		'myApp.controllers',
		'myApp.filters',
		'myApp.services',
		'myApp.directives',
		'CacheService',
		'infinite-scroll',
	]);

myApp.config(['$routeProvider', '$locationProvider', '$httpProvider', function($routeProvider, $locationProvider, $httpProvider) {
		$routeProvider.
			when('/', { templateUrl: 'partials/index.html', controller: "ChatAppCtrl" }).
			otherwise({ redirectTo: '/' });

		$httpProvider.defaults.useXDomain = true;
    	delete $httpProvider.defaults.headers.common['X-Requested-With'];

		// configure html5 to get links working
		// If you don't do this, you URLs will be base.com/#/home rather than base.com/home
		$locationProvider.html5Mode(true);
	}]);