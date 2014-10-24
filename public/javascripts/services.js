angular.module('chatAppServices', ['ngResource']).
	factory('ChatApp', ['$resource', function($resource) {
		return $resource('/celebrities/:celebrityId', { celebrityId: '@celebrityId'}, {
		  	query: { method: 'GET', params: { celebrityId: '@celebrityId' }, isArray: true }
		})
	}]);