/**
 * Created by Omar on 15/10/2015.
 */

angular.module('adresseTravailCtrls', ['ionic', 'ngOpenFB', 'parsingServices', /**'autocomplete'**/ 'angucomplete'])

	.controller('adresseTravailCtrl', function ($scope, $rootScope, localStorageService, $state, formatString, UpdateInServer, LoadList){

		// FORMULAIRE
		$scope.formData = {};
		$scope.formData.listCodes=[];

		// RECUPERATION SESSION-ID & EMPLOYEUR-ID
		$scope.updateAdresseTravEmployeur = function(){

			for(var obj in $scope.formData){
				console.log("formData["+obj+"] : "+$scope.formData[obj]);
			}

			var codePostal=$scope.formData.codePostal;
			var ville=$scope.formData.ville;
			var adresse1=$scope.formData.adresse1;
			var adresse2=$scope.formData.adresse2;

			// RECUPERATION CONNEXION
			var connexion=localStorageService.get('connexion');
			// RECUPERATION EMPLOYEUR ID
			var employeId=connexion.employeID;
			console.log("localStorageService.get(connexion) : "+JSON.stringify(connexion));
			// RECUPERATION SESSION ID
			sessionId=localStorageService.get('sessionID');

			// TEST DE VALIDATION
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
			metiers=localStorageService.get('metiers');
			//metiers=$rootScope.metiers;
			if(!metiers){
				// CHARGEMENT DES DONNES AUPRES BD
				LoadList.loadListMetiers(sessionId)
					.success(function (response){

						resp=formatString.formatServerResult(response);
						// DONNEES ONT ETE CHARGES
						console.log("les metiers ont été bien chargé");
						metiersObjects=resp.dataModel.rows.dataRow;
						//console.log("metiersObjects : "+JSON.stringify(metiersObjects));

						// GET METIERS
						metiers=[];
						metier={}; // metier.libelle | metier.id

						metiersList=[].concat(metiersObjects);
						for(var i=0; i<metiersList.length; i++){
							object=metiersList[i].dataRow.dataEntry;

							// PARCOURIR LIST PROPERTIES
							metier[object[0].attributeReference]=object[0].value;
							metier[object[1].attributeReference]=object[1].value;

							if(metier)
								metiers.push(metier);
							metier={}
						}

						console.log("metiers.length : "+metiers.length);
						/**for(var i=0; i<metiers.length; i++){
							console.log("pk_user_metier : "+metiers[i].pk_user_metier);
							console.log("libelle : "+metiers[i].libelle);
						}**/

						// PUT IN SESSION
						//$rootScope.metiers=metiers;
            localStorageService.set('metiers', metiers);
					}).error(function (err){
						console.log("error : GET DATA from metiers");
						console.log("error In : "+err);
					});
			}

			// CHARGEMENT LANGUES
			langues=localStorageService.get('langues');
			if(!langues){
				// CHARGEMENT DES DONNES AUPRES BD
				LoadList.loadListLangues(sessionId)
					.success(function (response){

						resp=formatString.formatServerResult(response);
						// DONNEES ONT ETE CHARGES
						console.log("les langues ont été bien chargé");
						languesObjects=resp.dataModel.rows.dataRow;

						// GET LANGUES
						langues=[];
						langue={}; // langue.libelle | langue.id

						languesList=[].concat(languesObjects);
						for(var i=0; i<languesList.length; i++){
							object=languesList[i].dataRow.dataEntry;

							// PARCOURIR LIST PROPERTIES
							langue[object[0].attributeReference]=object[0].value;
							langue[object[1].attributeReference]=object[1].value;

							if(langue)
								langues.push(langue);
							langue={}
						}

						console.log("langues.length : "+langues.length);
						// PUT IN SESSION
						//$rootScope.langues=langues;
            localStorageService.set('langues', langues);
					}).error(function (err){
						console.log("error : GET DATA from langues");
						console.log("error In : "+err);
					});
			}

			// CHARGEMENT JOBS
			var jobs=localStorageService.get('jobs');
			if(!jobs){
				// CHARGEMENT DES DONNES AUPRES BD
				LoadList.loadListJobs(sessionId)
					.success(function (response){

						var resp=formatString.formatServerResult(response);
						// DONNEES ONT ETE CHARGES
						console.log("les jobs ont été bien chargé");
						var jobsObjects=resp.dataModel.rows.dataRow;

						// GET LANGUES
						jobs=[];
						var job={}; // job.libelle | job.id

						var jobsList=[].concat(jobsObjects);
						for(var i=0; i<jobsList.length; i++){
							object=jobsList[i].dataRow.dataEntry;

							// PARCOURIR LIST PROPERTIES
							job[object[0].attributeReference]=object[0].value;
							job[object[1].attributeReference]=object[1].value;

							if(job)
								jobs.push(job);
							job={}
						}

						console.log("jobs.length : "+jobs.length);
						// PUT IN SESSION
						//$rootScope.jobs=jobs;
            localStorageService.set('jobs', jobs);

					}).error(function (err){
						console.log("error : GET DATA from jobs");
						console.log("error In : "+err);
					});
			}

			// CHARGEMENT COMPETENCES INDISPENSABLES
			var transvers=localStorageService.get('transvers');
			if(!transvers){
				// CHARGEMENT DES DONNES AUPRES BD
				LoadList.loadListIndespensables(sessionId)
					.success(function (response){

						resp=formatString.formatServerResult(response);
						// DONNEES ONT ETE CHARGES
						console.log("les transvers ont été bien chargé");
						var transversObjects=resp.dataModel.rows.dataRow;

						// GET TRANSVERS
						transvers=[];
						var transver={}; // transver.libelle | transver.id

						var transversList=[].concat(transversObjects);
						for(var i=0; i<transversList.length; i++){
							object=transversList[i].dataRow.dataEntry;

							// PARCOURIR LIST PROPERTIES
							transver[object[0].attributeReference]=object[0].value;
							transver[object[1].attributeReference]=object[1].value;

							if(transver)
								transvers.push(transver);
							transver={}
						}

						console.log("transvers.length : "+transvers.length);
						// PUT IN SESSION
						//$rootScope.transvers=transvers;
            localStorageService.set('transvers', transvers);
					}).error(function (err){
						console.log("error : GET DATA from transvers");
						console.log("error In : "+err);
					});
			}
			// REDIRECTION VERS PAGE - COMPETENCES
			$state.go('competence');


		}

		$scope.initForm=function(){
			$scope.formData.zipCodes=localStorageService.get('zipCodes');
			$scope.formData.villes=localStorageService.get('villes');
			for(var i=0; i<$scope.formData.zipCodes.length; i++)
				$scope.formData.listCodes[i]=$scope.formData.zipCodes[i].libelle;
		}

		$scope.updateZipCodes=function(typed){

			// VIDER LIST RESULT
			$scope.formData.listCodes=[];
			if($scope.formData.zipCodes.length <= 0)
				return;

			// PARCOURIR ALL CODES
			for(var i=0; i<$scope.formData.zipCodes.length; i++){
				var codePostal=$scope.formData.zipCodes[i];
				var code=String(codePostal.libelle);
				if(code.indexOf(typed) > -1){
					$scope.formData.listCodes.push(code);
					console.log("codePostal : "+JSON.stringify(codePostal));
				}
			}
		}

		$scope.$on( "$ionicView.beforeEnter", function( scopes, states ){
			if(states.fromCache && states.stateName == "adresseTravail" ){
				$scope.initForm();
			}
		});
	})
