/**
 * Created by Tamer on 15/10/2015.
 */

angular.module('competenceCtrls', ['ionic', 'ngCookies'])

  .controller('competenceCtrl', function ($scope, $cookieStore, $state) {
		$scope.njobyer = 1;
		$scope.metier = "Métier";
		
		// RECUPERATION EMPLOYEUR ID
		employeId=$cookieStore.get('employeID');
		console.log("$cookieStore.get : "+$cookieStore.get('employeID'));
		// RECUPERATION SESSION ID
		sessionId=$cookieStore.get('sessionID');
			
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
