/**
 * Created by Omar on 15/10/2015.
 */

angular.module('adresseTravailCtrls', ['ionic', 'ngOpenFB', 'ngCookies', 'parsingServices',
			'angucomplete', 'providerServices', 'validationDataServices', 'globalServices'])

	.controller('adresseTravailCtrl', function ($scope, $rootScope, $rootScope, $cookieStore, $state, formatString, 
					UpdateInServer, LoadList, DataProvider, Validator, Global, $ionicPopup, $ionicHistory){

		// FORMULAIRE
		$scope.formData = {};
		
		// RECUPERATION SESSION-ID & EMPLOYEUR-ID
		$scope.updateAdresseTravEmployeur = function(){
		  
			for(var obj in $scope.formData){
				//console.log("formData["+obj+"] : "+$scope.formData[obj]);
			}
			
			codePostal=0, ville=0;
			if(codePostal)
				codePostal=Number($scope.formData.codePostal.originalObject.pk_user_code_postal);
			if(ville)
				ville=Number($scope.formData.ville.originalObject.pk_user_ville);
			adresse1=$scope.formData.adresse1;
			adresse2=$scope.formData.adresse2;
			
			console.log("codePostal: "+codePostal);
			console.log("ville : "+ville);

			// RECUPERATION CONNEXION
			connexion=$cookieStore.get('connexion');
			// RECUPERATION EMPLOYEUR ID
			employeId=connexion.employeID;
			console.log("$cookieStore.get(connexion) : "+JSON.stringify(connexion));
			// RECUPERATION SESSION ID
			sessionId=$cookieStore.get('sessionID');
			
			// TEST DE VALIDATION
			if(!isNaN(codePostal) || !isNaN(ville) || codePostal!== 0 || ville !== 0 || adresse1  || adresse2){
				if(!adresse1)
					adresse1='';
				if(!adresse2)
					adresse2='';
				UpdateInServer.updateAdresseTravEmployeur(employeId, codePostal, ville, adresse1, adresse2, sessionId)
					.success(function (response){

						// DONNEES ONT ETE SAUVEGARDES
						console.log("les donnes ont été sauvegarde");
						console.log("response"+response);
						
						employeur=$cookieStore.get('employeur');
						if(!employeur)
							employeur={};
						adresseTravail={};
						adresseTravail={'codePostal': codePostal, 'ville': ville, 'adresse1': adresse1, 'adresse2': adresse2};
						employeur.adresseTravail=adresseTravail;
						
						// PUT IN SESSION
						$cookieStore.put('employeur', employeur);
						console.log("employeur : "+JSON.stringify(employeur));
					}).error(function (err){
						console.log("error : insertion DATA");
						console.log("error In updateAdresseTravEmployeur: "+err);
					});
			}
			
			/*** CHARGEMENT METIERS
			metiers=$cookieStore.get('metiers');
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
						
						// PUT IN SESSION
						$cookieStore.put('metiers', metiers);
						console.log("metiers : "+JSON.stringify(metiers));
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
						$cookieStore.put('langues', langues);
						console.log("langues : "+JSON.stringify(langues));
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
						jobsObjects=resp.dataModel.rows.dataRow;
						
						// GET LANGUES
						jobs=[];
						job={}; // job.libelle | job.id

						jobsList=[].concat(jobsObjects);
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
						$cookieStore.put('jobs', jobs);
						console.log("jobs : "+JSON.stringify(jobs));
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
						transversObjects=resp.dataModel.rows.dataRow;
						
						// GET TRANSVERS
						transvers=[];
						transver={}; // transver.libelle | transver.id

						transversList=[].concat(transversObjects);
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
						$cookieStore.put('transvers', transvers);
						console.log("transvers : "+JSON.stringify(transvers));
					}).error(function (err){
						console.log("error : GET DATA from transvers");
						console.log("error In : "+err);
					});
			}***/
			
			// REDIRECTION VERS PAGE - COMPETENCES
			$state.go('competence');
		}
		
		// VALIDATION
		$scope.validatElement=function(id){
			Validator.checkField(id);
		}
		
		$scope.initForm=function(){
			$scope.formData.zipCodes=DataProvider.getZipCodes();
			$scope.formData.villes=DataProvider.getVilles();
		}
		
		/**$scope.$on('update-list-code', function(event, args){
			
			var params = args.params;
			console.log("params : "+JSON.stringify(params));
			
			list=params.list;
			fk=params.fk;
			// NEW LIST - CODES POSTAL
			codes=[];
			
			if(list === "ville"){
				// VIDER LIST - ZIP CODES
				$scope.formData.zipCodes=[];
				// TABLE ASSOCIATION
				zip_ville=DataProvider.getZip_Ville();
				// TABLE CODES POSTAL
				zips=DataProvider.getZipCodes();
				for(var i=0; i<zip_ville.length; i++){
					if(Number(zip_ville[i]['ville']) === Number(fk)){
						// PARCOURIR LIST CODES POSTAL
						for(var j=0; j<zips.length; j++){
							if(Number(zips[j]['pk_user_code_postal']) === Number(zip_ville[i]['zip'])){
								zip={};
								zip.pk_user_code_postal=zips[j]['pk_user_code_postal'];
								zip.libelle=zips[j]['libelle'];
								codes.push(zip);
							}
						}
					}
				}
				
				// UPDATE ZIP CODES - GLOBAL
				$scope.formData.zipCodes=[];
				$scope.formData.zipCodes=codes;
				console.log("New $scope.formData.zipCodes : "+$scope.formData.zipCodes.length);
				
				// ENVOI AU AUTOCOMPLETE CONTROLLEUR
				//$rootScope.$broadcast('load-new-list', {newList: {codes}});
			}
		});**/
		
		$scope.$on('show-pop-up', function(event, args){
			
			var params = args.params;
			console.log("params : "+JSON.stringify(params));
			
			var myPopup = $ionicPopup.show({
			  
			  template: "Adresse de travail est identique à l'adresse du siège social. <br>",
			  title: "<div class='vimgBar'><img src='img/vit1job-mini2.png'></div>",
			  buttons: [
				{
					text: '<b>Non</b>',
					type: 'button-dark'
				},{
					text: '<b>Oui</b>',
					type: 'button-calm',
					onTap: function(e){
						$scope.formData.adresse1=adresse1;
						$scope.formData.adresse2=adresse2;
						if(params.ville)
							document.getElementById('ex2_value').value=params.vi;
						if(params.code)
							document.getElementById('ex3_value').value=params.code;
					}
				}
			 ]
		 });
		});
		
		$scope.$on("$ionicView.beforeEnter", function(scopes, states){
			if(states.fromCache && states.stateName == "adresseTravail" ){
				$scope.initForm();
				
				// AFFICHE POPUP - SI JE VIENS
				if($ionicHistory.backView() === "adressePersonel"){
					// SHOW 
					/**Global.showCopyAddress("Adresse de travail est identique à l'adresse du siège social ?")
						.then(function(result){    
							// COPY SIEGE IN ADDRESS TRAVAIL
							employeur=$cookieStore.get('employeur');
							
							if(employeur){
								
								$scope.formData.adresse1=employeur.adressePersonel.adresse1;
								$scope.formData.adresse2= employeur.adressePersonel.adresse2;
							}
							console.log("adressePersonel : popup[Valider] : "+JSON.stringify(employeur));
						});**/
				}
				console.log("Je suis ds $ionicView.beforeEnter(adresseTravail)");
				employeur=$cookieStore.get('employeur');
				if(employeur){
					// INITIALISATION FORMULAIRE
					if(employeur['adresseTravail']){
						// INITIALISATION FORMULAIRE
						if(employeur['adresseTravail'].codePostal)
							$scope.formData['codePostal']=employeur['adresseTravail']['codePostal'];
						if(employeur.adresseTravail.ville)
							$scope.formData['ville']=employeur['adresseTravail']['ville'];
						if(employeur['adresseTravail']){
							$scope.formData['adresse1']=employeur['adresseTravail']['adresse1'];
							$scope.formData['adresse2']=employeur['adresseTravail']['adresse2'];
						}
					}
				}
			}
		});
	})
