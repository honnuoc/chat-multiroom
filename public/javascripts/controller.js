// Managing the celebrity list
function ChatAppCtrl($scope, ChatApp) {
  	ChatApp.query(function(data) {
    	$scope.celebrities = data;
  	});
}
