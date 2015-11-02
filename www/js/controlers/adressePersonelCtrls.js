/**
 * Created by Omar on 15/10/2015.
 */

starter

	.controller('adressePersonelCtrl', function ($scope, $rootScope, $cookieStore, $state, UpdateInServer,
			DataProvider, Validator, Global ){

		// FORMULAIRE
		$scope.formData = {};

		// RECUPERATION SESSION-ID & EMPLOYEUR-ID
		$scope.updateAdressePersEmployeur = function(){

			for(var obj in $scope.formData){
				//console.log("formData["+obj+"] : "+$scope.formData[obj]);
			}
			/**if($scope.formData.codePostal !== null && typeof $scope.formData.codePostal !== 'undefined'){
				console.log("code postale: "+JSON.stringify($scope.formData.codePostal));
				console.log("postale: "+$scope.formData.codePostal.originalObject.pk_user_code_postal);
			}
			return;**/

			var codePostal="A", ville="A";
			if(typeof $scope.formData.codePostal !== 'undefined')
				if(typeof $scope.formData.codePostal.originalObject !== 'undefined')
					codePostal=Number($scope.formData.codePostal.originalObject.pk_user_code_postal);
			if(typeof $scope.formData.ville !== 'undefined')
				if(typeof $scope.formData.ville.originalObject !== 'undefined')
					ville=Number($scope.formData.ville.originalObject.pk_user_ville);
			var adresse1=$scope.formData.adresse1;
			var adresse2=$scope.formData.adresse2;

			console.log("codePostal: "+codePostal);
			console.log("ville : "+ville);

			// RECUPERATION CONNEXION
			var connexion=$cookieStore.get('connexion');
			// RECUPERATION EMPLOYEUR ID
			var employeId=connexion.employeID;
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
							var employeur={};
						var adressePersonel={};
						adressePersonel={'codePostal': codePostal, 'ville': ville, 'adresse1': adresse1, 'adresse2': adresse2};
						employeur.adressePersonel=adressePersonel;

						// PUT IN SESSION
						$cookieStore.put('employeur', employeur);
						console.log("employeur : "+JSON.stringify(employeur));

						var code="", vi="";
						if(typeof $scope.formData.codePostal !== 'undefined')
							if(typeof $scope.formData.codePostal.originalObject !== 'undefined')
								code=$scope.formData.codePostal.originalObject.libelle;
						if(typeof $scope.formData.ville !== 'undefined')
							if(typeof $scope.formData.ville.originalObject !== 'undefined')
								vi=$scope.formData.ville.originalObject.libelle;

						// AFFICHE POPUP
						$rootScope.$broadcast('show-pop-up', {params:
							{
								'adresse1': adresse1,
								'adresse2': adresse2,
								'vi': vi,
								'code': code
							}
								});
					}).error(function (err){
						console.log("error : insertion DATA");
						console.log("error In updateAdressePersEmployeur: "+err);
					});
			}
			// REDIRECTION VERS PAGE - ADRESSE TRAVAIL
			$state.go('adresseTravail');
		};

		// VALIDATION - FIELD
		$scope.validatElement=function(id){
			Validator.checkField(id);
		};

		$scope.$watch('formData.zipCodes', function(){
			console.log('hey, formData.zipCodes has changed!');
			//console.log('zipCodes.length : '+$scope.formData.zipCodes.length);
		});

		$scope.$on('update-list-ville', function(event, args){

			var params = args.params;
			console.log("params : "+JSON.stringify(params));

			var list =params.list;
			var fk=params.fk;
			// NEW LIST - VILLES
			var vls=[];

			if(list === "postal"){
				// VIDER LIST - VILLES
				$scope.formData.villes=[];

				var allVilles=DataProvider.getVilles();
				var villes=[];
				for(var i=0; i<allVilles.length; i++){
					if(allVilles[i]['fk_user_code_postal'] === fk){
						villes.push(allVilles[i]);
					}
				}


				// UPDATE ZIP CODES - GLOBAL
				$scope.formData.villes=[];
				$scope.formData.villes=villes;
				console.log("New $scope.formData.villes : "+JSON.stringify($scope.formData.villes));

				// ENVOI AU AUTOCOMPLETE CONTROLLEUR
				//$rootScope.$broadcast('load-new-list', {newList: {codes}});
			}
		});

		$scope.initForm=function(){
			/**var elm = angular.element(document.querySelector('#ex0_value'));
			elm.val("Ville");**/
			$scope.formData.zipCodes=DataProvider.getZipCodes();
			$scope.formData.villes=DataProvider.getVilles();
		};

		$scope.$on("$ionicView.beforeEnter", function( scopes, states ){
			if(states.fromCache && states.stateName == "adressePersonel" ){
				$scope.initForm();

				console.log("Je suis ds $ionicView.beforeEnter(adressePersonel)");
			var	employeur =$cookieStore.get('employeur');
				if(employeur){
					// INITIALISATION FORMULAIRE
					if(employeur['adressePersonel']){
						// INITIALISATION FORMULAIRE
						/**if(employeur['adressePersonel'].codePostal)
							document.getElementById('ex0_value').value=employeur['adressePersonel']['codePostal'];
						if(employeur.adresseTravail.ville)
							document.getElementById('ex1_value').value=employeur['adressePersonel']['ville'];**/
						if(employeur['adressePersonel']){
							$scope.formData['adresse1']=employeur['adressePersonel']['adresse1'];
							$scope.formData['adresse2']=employeur['adressePersonel']['adresse2'];
						}
					}
				}

				/**
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
				} **/
			}
		});
	})
;
