/**
 * Created by Omar on 15/10/2015.
 */


angular.module('adressePersonelCtrls', ['ionic', 'ngOpenFB', 'ngCookies', 'providerServices', 
		'validationDataServices', 'globalServices'])

	.controller('adressePersonelCtrl', function ($scope, $rootScope, $cookieStore, $state, UpdateInServer, 
			DataProvider, Validator, Global ){

		// FORMULAIRE
		$scope.formData = {};
		
		// RECUPERATION SESSION-ID & EMPLOYEUR-ID
		$scope.updateAdressePersEmployeur = function(){
		  
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
			//if(codePostal !== '' && ville !== '' && adresse1 !== '' && adresse2 !== ''){
			if(!isNaN(codePostal) || !isNaN(ville) || adresse1 || adresse2){
				if(!adresse1)
					adresse1='';
				if(!adresse2)
					adresse2='';
				
				UpdateInServer.updateAdressePersEmployeur(employeId, codePostal, ville, adresse1, adresse2, sessionId)
					.success(function (response){

						// DONNEES ONT ETE SAUVEGARDES
						console.log("les donnes ont été sauvegarde");
						console.log("response"+response);
						
						employeur=$cookieStore.get('employeur');
						if(!employeur)
							employeur={};
						adressePersonel={};
						adressePersonel={'codePostal': codePostal, 'ville': ville, 'adresse1': adresse1, 'adresse2': adresse2};
						employeur.adressePersonel=adressePersonel;
						
						// PUT IN SESSION
						$cookieStore.put('employeur', employeur);
						console.log("employeur : "+JSON.stringify(employeur));
						
						var code="", vi="";
						if($scope.formData.codePostal)
							code=$scope.formData.codePostal.originalObject.libelle;
						if($scope.formData.ville)
							vi=$scope.formData.ville.originalObject.libelle;
						
						// AFFICHE POPUP
						$rootScope.$broadcast('show-pop-up', {params: 
							{
								adresse1, 
								adresse2,
								vi, 
								code
							}
								});	
					}).error(function (err){
						console.log("error : insertion DATA");
						console.log("error In updateAdressePersEmployeur: "+err);
					});
			}
			// REDIRECTION VERS PAGE - ADRESSE TRAVAIL
			$state.go('adresseTravail');
		}
		
		// VALIDATION - FIELD
		$scope.validatElement=function(id){
			Validator.checkField(id);
		}
		
		$scope.$watch('formData.zipCodes', function(){
			console.log('hey, formData.zipCodes has changed!');
			//console.log('zipCodes.length : '+$scope.formData.zipCodes.length);
		});
		
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
		
		$scope.initForm=function(){
			/**var elm = angular.element(document.querySelector('#ex0_value'));
			elm.val("Ville");**/	
			$scope.formData.zipCodes=DataProvider.getZipCodes();
			$scope.formData.villes=DataProvider.getVilles();
		}
			
		$scope.$on("$ionicView.beforeEnter", function( scopes, states ){
			if(states.fromCache && states.stateName == "adressePersonel" ){
				$scope.initForm();
				
				console.log("Je suis ds $ionicView.beforeEnter(adressePersonel)");
				employeur=$cookieStore.get('employeur');
				if(employeur && employeur['adressePersonel']){
					// INITIALISATION FORMULAIRE
					if(employeur['adressePersonel'].codePostal)
						$scope.formData.codePostal=employeur.adressePersonel.codePostal;
					if(employeur['adressePersonel'].ville)
						$scope.formData.ville=employeur.adressePersonel.ville;
					if(employeur['adressePersonel']){
						$scope.formData.adresse1=employeur['adressePersonel'].adresse1;
						$scope.formData.adresse2=employeur['adressePersonel'].adresse2;
					}
				}
			}
		});
	})
