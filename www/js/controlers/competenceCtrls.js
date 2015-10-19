/**
 * Created by Tamer on 15/10/2015.
 */

angular.module('competenceCtrls', ['ionic', 'ngCookies'])

  .controller('competenceCtrl', function ($scope, $cookieStore) {
    $scope.njobyer = 1;
    //$scope.rangeValue = 0;
    $scope.rangeModel = 0;
    $scope.maitriseIcon = "icon ion-ios-rainy calm";
    $scope.maitrise = "Débutant";

    // RECUPERATION EMPLOYEUR ID
    employeId=$cookieStore.get('employeID');
    console.log("$cookieStore.get : "+$cookieStore.get('employeID'));
    // RECUPERATION SESSION ID
    sessionId=$cookieStore.get('sessionID');

    $scope.rangeChange = function(rangeModel) {
      if (rangeModel <= 25 ){
        $scope.maitrise = "Débutant";
        $scope.maitriseIcon = "icon ion-ios-rainy calm";
      }

      else if (rangeModel > 25 && rangeModel <= 50 ) {
        $scope.maitrise = 'Habitué';
        $scope.maitriseIcon = "icon ion-ios-cloudy-outline calm";
      }

      else if (rangeModel > 50 && rangeModel <= 75 ){
        $scope.maitrise = 'Confirmé';
        $scope.maitriseIcon = "icon ion-ios-partlysunny-outline calm";
      }
      else if (rangeModel > 75 && rangeModel <= 100 ){
        $scope.maitrise = 'Waouh!';
        $scope.maitriseIcon = "icon ion-ios-sunny-outline calm";
      }


      //console.log ( $scope.rangeValue);
      console.log ( rangeModel);

      /*var deviceInfo = cordova.require("cordova/plugin/DeviceInformation");
      deviceInfo.get(function(result) {
        //fetch the device data
        console.log("result = " + result);
        $scope.maitrise = result;
      }, function() {
        console.log("error");
        $scope.maitrise = "error";
      });*/

    };

    $scope.addCompetence = function(){
      $scope.njobyer = $scope.njobyer + 1;
    }

		$scope.afficheList = function(){
			// GET LIST
			metiers=$cookieStore.get('metiers');
			langues=$cookieStore.get('langues');
			jobs=$cookieStore.get('jobs');
			transvers=$cookieStore.get('transvers');

			// AFFICHAGE
			console.log("metiers : "+metiers);
			console.log("langues : "+langues);
			console.log("jobs : "+jobs);
			console.log("transvers : "+transvers);

			// REDIRECTION VERS RECHERCHE
			$state.go("search");
		}
  });
