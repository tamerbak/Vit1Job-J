/**
 * Created by Omar on 15/10/2015.
 */

angular.module('adressePersonelCtrls', ['ionic', 'ngOpenFB'])

	.controller('adressePersonelCtrl', function ($scope, $state, UpdateInServer){

		// RECUPERATION SESSION-ID & EMPLOYEUR-ID
		$scope.updateAdressePersEmployeur = function(codePostal, ville, adresse1, adresse2){

			// TEST DE VALIDATION
			//if(codePostal !== '' && ville !== '' && adresse1 !== '' && adresse2 !== ''){
      if (1!=1){
				UpdateInServer.updateAdressePersEmployeur(id, codePostal, ville, adresse1, adresse2, sessionID)
					.success(function (response){

						// DONNEES SAUVEGARDES
						// REDIRECTION VERS PAGE - ADRESSE TRAVAIL
						$state.go("adresseTravail");
					}).error(function (err){
						console.log("error : insertion DATA");
						console.log("error In updateAdressePersEmployeur: "+err);
					});
			}
			else{
        $state.go('adresseTravail');
				//console("$scope : "+$scope);
			}

		}
	})
