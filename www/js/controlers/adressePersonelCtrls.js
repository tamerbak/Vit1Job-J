/**
 * Created by Omar on 15/10/2015.
 */

angular.module('adressePersonelCtrls', ['ionic', 'ngOpenFB', 'ngCookies'])

	.controller('adressePersonelCtrl', function ($scope, $cookieStore, $state, UpdateInServer){

		// RECUPERATION SESSION-ID & EMPLOYEUR-ID
		$scope.updateAdressePersEmployeur = function(codePostal, ville, adresse1, adresse2){
			
			// RECUPERATION EMPLOYEUR ID
			employeId=$cookieStore.get('employeID');
			console.log("$cookieStore.get : "+$cookieStore.get('employeID'));
			// RECUPERATION SESSION ID
			sessionId=$cookieStore.get('sessionID');
			
			// TEST DE VALIDATION
			//if(codePostal !== '' && ville !== '' && adresse1 !== '' && adresse2 !== ''){
			if(codePostal && ville && adresse1 && adresse2){
			//if (1!=1){
				UpdateInServer.updateAdressePersEmployeur(employeId, codePostal, ville, adresse1, adresse2, sessionId)
					.success(function (response){

						// DONNEES ONT ETE SAUVEGARDES
						console.log("les donnes ont été sauvegarde");
						console.log("response"+response);
					}).error(function (err){
						console.log("error : insertion DATA");
						console.log("error In updateAdressePersEmployeur: "+err);
					});
			}
			
			// REDIRECTION VERS PAGE - ADRESSE TRAVAIL
			$state.go('adresseTravail');

		}
	})
