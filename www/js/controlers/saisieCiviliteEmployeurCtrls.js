/**
 * Created by Omar on 14/10/2015.
 */
/**
 * Modified by HODAIKY on 25/10/2015.
 */
'use strict';

starter

	.controller('saisieCiviliteEmployeurCtrl', function ($scope, $cookieStore, $state, UpdateInServer, UploadFile, $base64, LoadList, formatString){

		// FORMULAIRE
		$scope.formData = {};

		$scope.updateCiviliteEmployeur = function(){

			for(var obj in $scope.formData){
				console.log("formData["+obj+"] : "+$scope.formData[obj]);
			}

			var titre=$scope.formData.civ;
			var nom=$scope.formData.nom;
			var prenom=$scope.formData.prenom;
			var entreprise=$scope.formData.entreprise;
			var siret=$scope.formData.siret;
			var ape=$scope.formData.ape;
			var numUssaf=$scope.formData.numUssaf;

			// RECUPERATION CONNEXION
			var connexion=$cookieStore.get('connexion');
			// RECUPERATION EMPLOYEUR ID
			var employeId=connexion.employeID;
			console.log("$cookieStore.get(connexion) : "+JSON.stringify(connexion));
			// RECUPERATION SESSION ID
			sessionId=$cookieStore.get('sessionID');

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

			// LOAD LIST ZIP-CODE
			var codePostals=$cookieStore.get('zipCodes');
			if(!codePostals){
				LoadList.loadZipCodes(sessionId)
					.success(function (response){
							var resp=formatString.formatServerResult(response);
							// DONNEES ONT ETE CHARGES
							console.log("les ZipCodes ont été bien chargé");
							var zipCodesObjects=resp.dataModel.rows.dataRow;

							if(typeof zipCodesObjects === 'undefined' || zipCodesObjects.length<=0 || zipCodesObjects===""){
								console.log('Aucune résultat trouvé');
								// PUT IN SESSION
								$cookieStore.put('zipCodes', []);
								return;
							}

							// GET ZIP-CODE
							var zipCodes=[];
							var zipCode={}; // zipCode.libelle | zipCode.id

							var zipCodesList=[].concat(zipCodesObjects);
							console.log("zipCodesList.length : "+zipCodesList.length);
							for(var i=0; i<zipCodesList.length; i++){
								var object=zipCodesList[i].dataRow.dataEntry;

								// PARCOURIR LIST PROPERTIES
								zipCode[object[0].attributeReference]=object[0].value;
								zipCode[object[1].attributeReference]=object[1].value;

								if(zipCode)
									zipCodes.push(zipCode);
								zipCode={}
							}

							console.log("zipCodes.length : "+zipCodes.length);
							// PUT IN SESSION
							$cookieStore.put('zipCodes', zipCodes);
							console.log("zipCodes : "+JSON.stringify(zipCodes));
						}).error(function (err){
							console.log("error : LOAD DATA");
							console.log("error in loadZipCodes : "+err);
						});
			}

			// REDIRECTION VERS PAGE - ADRESSE PERSONEL
			$state.go('adressePersonel');
		};

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
		};

		$scope.initForm=function(){
			// GET LIST
			$scope.formData={
				'civilites': $cookieStore.get('civilites')};
		};

		$scope.$on( "$ionicView.beforeEnter", function(scopes, states){
			if(states.fromCache && states.stateName == "saisieCiviliteEmployeur"){
				$scope.initForm();
			}
		});
	})

;
