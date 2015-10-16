/**
 * Created by Omar on 15/10/2015.
 */

angular.module('adresseTravailCtrls', ['ionic', 'ngOpenFB'])

	.controller('adresseTravailCtrl', function ($scope, $state, UpdateInServer){

		// RECUPERATION SESSION-ID & EMPLOYEUR-ID
		$scope.updateAdresseTravEmployeur = function(codePostal, ville, adresse1, adresse2){

			// TEST DE VALIDATION
			//if(codePostal !== '' && ville !== '' && adresse1 !== '' && adresse2 !== ''){
      if (1==2){
				UpdateInServer.updateAdresseTravEmployeur(id, codePostal, ville, adresse1, adresse2, sessionID)
					.success(function (response){

						// DONNEES SAUVEGARDES
						// REDIRECTION VERS PAGE - ADRESSE TRAVAIL
						$state.go("competence");
					}).error(function (err){
						console.log("error : insertion DATA");
						console.log("error In updateAdresseTravEmployeur: "+err);
					});
			}
			else{
        $state.go('competence');
				//console("$scope : "+$scope);
			}

		}
	})
