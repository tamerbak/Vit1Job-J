/**
 * Created by Tamer on 14/10/2015.
 */

angular.module('connectionCtrls', ['ionic', 'ngOpenFB'])

  .controller('connectCtrl', function ($scope,$state, ngFB) {
  $scope.fbLogin = function () {
    ngFB.login({scope: 'email'}).then(
      function (response) {
        if (response.status === 'connected') {
          console.log('Facebook login succeeded');
          $state.go('profile');
        } else {
          alert('Facebook login failed');
        }
      });
  };
})
