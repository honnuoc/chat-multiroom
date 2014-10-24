angular.module('chatApp',
	[
		'chatAppServices'
	]
	).
	config(['$routeProvider', function($routeProvider) {
     	$routeProvider.
            when('/celebrities', { templateUrl: 'partials/index.html', controller:ChatAppCtrl }).
            otherwise({ redirectTo: '/celebrities' });
    }]);