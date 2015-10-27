/**
 * Created by Omar on 15/10/2015.
 */

/**
 * Modified by HODAIKY on 24/10/2015.
 */
'use strict';

starter
	.controller('adressePersonelCtrl', function ($scope, localStorageService, $state, UpdateInServer){

		// FORMULAIRE
		$scope.formData = {};

		// RECUPERATION SESSION-ID & EMPLOYEUR-ID
		$scope.updateAdressePersEmployeur = function(){

			for(var obj in $scope.formData){
				console.log("formData["+obj+"] : "+$scope.formData[obj]);
			}

			var codePostal=$scope.formData.codePostal;
			var ville=$scope.formData.ville;
			var adresse1=$scope.formData.adresse1;
			var adresse2=$scope.formData.adresse2;

			// RECUPERATION CONNEXION
			var connexion = localStorageService.get('connexion');
			// RECUPERATION EMPLOYEUR ID
			employeId=connexion.employeID;
			console.log("localStorageService.get(connexion) : "+JSON.stringify(connexion));
			// RECUPERATION SESSION ID
			sessionId=localStorageService.get('sessionID');

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


		};

		$scope.initForm=function(){
			$scope.formData.zipCodes=localStorageService.get('zipCodes');
		};

		$scope.$on( "$ionicView.beforeEnter", function( scopes, states ){
			if(states.fromCache && states.stateName == "adressePersonel" ){
				$scope.initForm();
			}
		});
	});
