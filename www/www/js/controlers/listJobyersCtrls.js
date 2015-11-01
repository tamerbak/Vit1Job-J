/**
 * Created by Tamer on 14/10/2015.
 */

angular.module('listCtrls', ['ionic'])
  .controller('listCtrl', function ($scope, $rootScope) {
    $scope.jobyersForMe = $rootScope.jobyersForMe;

  })
