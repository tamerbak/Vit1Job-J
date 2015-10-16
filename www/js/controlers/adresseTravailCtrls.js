/**
 * Created by Omar on 15/10/2015.
 */

angular.module('adresseTravailCtrls', ['ionic', 'ngOpenFB', 'ngCookies', 'parsingServices'])

	.controller('adresseTravailCtrl', function ($scope, $cookieStore, $state, UpdateInServer, LoadList){

		// RECUPERATION SESSION-ID & EMPLOYEUR-ID
		$scope.updateAdresseTravEmployeur = function(codePostal, ville, adresse1, adresse2){

			// RECUPERATION EMPLOYEUR ID
			employeId=$cookieStore.get('employeID');
			console.log("$cookieStore.get : "+$cookieStore.get('employeID'));
			// RECUPERATION SESSION ID
			sessionId=$cookieStore.get('sessionID');
			
			// TEST DE VALIDATION
			//if(codePostal !== '' && ville !== '' && adresse1 !== '' && adresse2 !== ''){
			if(codePostal && ville && adresse1  && adresse2){
			//if (1==2){
				UpdateInServer.updateAdresseTravEmployeur(employeId, codePostal, ville, adresse1, adresse2, sessionId)
					.success(function (response){

						// DONNEES ONT ETE SAUVEGARDES
						console.log("les donnes ont été sauvegarde");
						console.log("response"+response);
						
					}).error(function (err){
						console.log("error : insertion DATA");
						console.log("error In updateAdresseTravEmployeur: "+err);
					});
			}
			
			// CHARGEMENT METIERS
			metiers=$cookieStore.get('metiers');
			if(!metiers){
				// CHARGEMENT DES DONNES AUPRES BD
				LoadList.loadListMetiers(sessionId)
					.success(function (response){

						resp=formatString.formatServerResult(response);
						// DONNEES ONT ETE CHARGES
						console.log("les metiers ont été bien chargé");
						$cookieStore.put('metiers', resp.dataModel);
					}).error(function (err){
						console.log("error : GET DATA from metiers");
						console.log("error In : "+err);
					});
			}
			// CHARGEMENT LANGUES
			langues=$cookieStore.get('langues');
			if(!langues){
				// CHARGEMENT DES DONNES AUPRES BD
				LoadList.loadListLangues(sessionId)
					.success(function (response){

						resp=formatString.formatServerResult(response);
						// DONNEES ONT ETE CHARGES
						console.log("les langues ont été bien chargé");
						$cookieStore.put('langues', resp.dataModel);
					}).error(function (err){
						console.log("error : GET DATA from langues");
						console.log("error In : "+err);
					});
			}
			// CHARGEMENT JOBS
			jobs=$cookieStore.get('jobs');
			if(!jobs){
				// CHARGEMENT DES DONNES AUPRES BD
				LoadList.loadListJobs(sessionId)
					.success(function (response){

						resp=formatString.formatServerResult(response);
						// DONNEES ONT ETE CHARGES
						console.log("les jobs ont été bien chargé");
						$cookieStore.put('jobs', resp.dataModel);
					}).error(function (err){
						console.log("error : GET DATA from jobs");
						console.log("error In : "+err);
					});
			}
			// CHARGEMENT COMPETENCES INDISPENSABLES
			transvers=$cookieStore.get('transvers');
			if(!transvers){
				// CHARGEMENT DES DONNES AUPRES BD
				LoadList.loadListIndespensables(sessionId)
					.success(function (response){

						resp=formatString.formatServerResult(response);
						// DONNEES ONT ETE CHARGES
						console.log("les transvers ont été bien chargé");
						$cookieStore.put('transvers', resp.dataModel);
					}).error(function (err){
						console.log("error : GET DATA from transvers");
						console.log("error In : "+err);
					});
			}
			// REDIRECTION VERS PAGE - COMPETENCES
			$state.go('competence');

		}
	})
