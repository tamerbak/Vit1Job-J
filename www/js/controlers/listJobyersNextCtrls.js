/**
 * Created by Tamer on 14/10/2015.
 */
angular.module('listNextCtrls', ['ionic'])

  .controller('listNextCtrl', function ($scope, $rootScope) {
    $scope.jobyersNextToMe = $rootScope.jobyersNextToMe;
  })
