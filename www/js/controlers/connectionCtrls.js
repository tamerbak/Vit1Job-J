/**
 * Created by Tamer on 14/10/2015.
 */

angular.module('connectionCtrls', ['ionic', 'ngOpenFB', 'globalServices'])

  .controller('connectCtrl', function ($scope, $state, ngFB, Global) {
	  
	  $scope.fbLogin = function(){
		  ngFB.login({scope: 'email'}).then(
			function (response){
				if(response.status === 'connected'){
					console.log('Facebook login succeeded');
					$state.go('profile');
				} 
				else{
					alert('Facebook login failed');
				}
			});
	  };
	 
	  $scope.showAlert = function(){
		  Global.showAlert();
	  }
  })
