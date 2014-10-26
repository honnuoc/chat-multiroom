// Managing the celebrity list
function ChatAppCtrl($scope, ChatApp) {
	ChatApp.query(function(data) {
		$scope.celebrities = data;
		$scope.selected = { value: data[0].facebook_id };
		// console.log($scope.selected);
	});
	$scope.chatType = function(event){
		$scope.selected = { value: celebrityId };

		if(celebrityId) {
			socket.emit('switchRoom', celebrityId);
		} else {
			alert('You must select a room to enter');
		}
	};
	$scope.switchRoom = function(celebrityId){
		$scope.selected = { value: celebrityId };

		if(celebrityId) {
			socket.emit('switchRoom', celebrityId);
		} else {
			alert('You must select a room to enter');
		}
	};
}
