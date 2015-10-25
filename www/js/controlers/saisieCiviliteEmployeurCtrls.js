/**
 * Created by Omar on 14/10/2015.
 */


angular.module('saisieCiviliteEmployeurCtrls', ['ionic', 'ngOpenFB', 'fileServices', 'base64',
		'wsConnectors', 'parsingServices', 'providerServices'])

	.controller('saisieCiviliteEmployeurCtrl', function ($scope, localStorageService, $state, UpdateInServer, UploadFile, $base64,
				LoadList, formatString, DataProvider){

		// FORMULAIRE
		$scope.formData = {};

    ngFB.api({
      path: '/me',
      params: {fields: 'id,first_name,last_name,gender,work,location'}
    }).then(
      function (user) {
        $scope.user = user;
        if(user.gender == "male")
          $scope.formData.civ =  "Monsieur";
        else if(user.gender == "female")
          $scope.formData.civ =  "Mademoiselle";
        else
          $scope.formData.civ =  "Titre";
        $scope.formData.prenom = user.first_name;
        $scope.formData.nom = user.last_name;
        $scope.formData.entreprise = user.work[0].employer.name;
        localStorage.setItem('userCity', user.location.name);
      },
      function (error) {
        alert('Facebook error: ' + error.error_description);
      });

    $scope.updateCiviliteEmployeur = function(){

			for(var obj in $scope.formData){
				console.log("formData["+obj+"] : "+$scope.formData[obj]);
			}

			titre=$scope.formData.civ;
			nom=$scope.formData.nom;
			prenom=$scope.formData.prenom;
			entreprise=$scope.formData.entreprise;
			siret=$scope.formData.siret;
			ape=$scope.formData.ape;
			numUssaf=$scope.formData.numUssaf;

			// RECUPERATION CONNEXION
			connexion=localStorageService.get('connexion');
			// RECUPERATION EMPLOYEUR ID
			employeId=connexion.employeID;
			console.log("localStorageService.get(connexion) : "+JSON.stringify(connexion));
			// RECUPERATION SESSION ID
			sessionId=localStorageService.get('sessionID');

			if(titre && nom && prenom && entreprise && siret && ape && numUssaf){
			//if (1==2) {
				// UPDATE EMPLOYEUR
				UpdateInServer.updateCiviliteInEmployeur(
					Number(employeId), Number(titre), nom, prenom, entreprise, siret, ape, numUssaf, sessionId)
						.success(function (response){

							// DONNEES ONT ETE SAUVEGARDES
							console.log("les donnes ont été sauvegarde");
							console.log("response"+response);

						}).error(function (err){
							console.log("error : insertion DATA");
							console.log("error In updateCiviliteInEmployeur: "+err);
						});
			}

			// UPLOAD IMAGE
			if($scope.formData.imageEncode){
				console.log("imageName : "+$scope.formData.imageName);
				console.log("imageEncode : "+$scope.formData.imageEncode);

				UploadFile.uploadFile($scope.formData.imageName, $scope.formData.imageEncode, employeId)
					.success(function (response){

						// FILE A ETE BIEN TRANSFERE
						console.log("File est bien uploadé");
						console.log("response : "+response);

					}).error(function (err){
						console.log("error : upload File");
						console.log("error In UploadFile.uploadFile(): "+err);
					});
			}

			/*** LOAD LIST ZIP-CODE
			codePostals=localStorageService.get('zipCodes');
			if(!codePostals){
				LoadList.loadZipCodes(sessionId)
					.success(function (response){
							resp=formatString.formatServerResult(response);
							// DONNEES ONT ETE CHARGES
							console.log("les ZipCodes ont été bien chargé");
							zipCodesObjects=resp.dataModel.rows.dataRow;

							if(typeof zipCodesObjects === 'undefined' || zipCodesObjects.length<=0 || zipCodesObjects===""){
								console.log('Aucune résultat trouvé');
								// PUT IN SESSION
								localStorageService.set('zipCodes', []);
								return;
							}

							// GET ZIP-CODE
							zipCodes=[];
							zipCode={}; // zipCode.libelle | zipCode.id

							zipCodesList=[].concat(zipCodesObjects);
							console.log("zipCodesList.length : "+zipCodesList.length);
							for(var i=0; i<zipCodesList.length; i++){
								object=zipCodesList[i].dataRow.dataEntry;

								// PARCOURIR LIST PROPERTIES
								zipCode[object[0].attributeReference]=object[0].value;
								zipCode[object[1].attributeReference]=object[1].value;

								if(zipCode)
									zipCodes.push(zipCode);
								zipCode={}
							}

							console.log("zipCodes.length : "+zipCodes.length);
							// PUT IN SESSION
							localStorageService.set('zipCodes', zipCodes);
							console.log("zipCodes : "+JSON.stringify(zipCodes));
						}).error(function (err){
							console.log("error : LOAD DATA");
							console.log("error in loadZipCodes : "+err);
						});
			}***/

			// REDIRECTION VERS PAGE - ADRESSE PERSONEL
			$state.go('adressePersonel');
		}

		$scope.loadImage=function(){

			function el(id){
				var elem = document.getElementById(id);
				if(typeof elem !== 'undefined' && elem !== null){
					return elem;
				}
			} // Get elem by ID

			if(image.files && image.files[0]){

				var FR= new FileReader();
				FR.onload = function(e){
					// RECUPERE FILE-NAME
					$scope.formData.imageName=image.files[0].name;

					// RECUPERE ENCODAGE-64
					$scope.formData.imageEncode=e.target.result;
				};
				FR.readAsDataURL(image.files[0]);
			}
		}

		$scope.initForm=function(){
			// GET LIST
			$scope.formData={'civilites': DataProvider.getCivilites()};
		}

		$scope.$on( "$ionicView.beforeEnter", function(scopes, states){
			if(states.fromCache && states.stateName == "saisieCiviliteEmployeur"){
				$scope.initForm();
			}
		});
	})

