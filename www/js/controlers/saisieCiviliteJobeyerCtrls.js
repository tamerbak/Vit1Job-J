/**
 * Created by Omar on 14/10/2015.
 */
'use strict';
starter
	.controller('saisieCiviliteJobeyerCtrl', function ($scope, $rootScope, $cookieStore, $state, UpdateInServer, UploadFile, $base64,
				LoadList, formatString, DataProvider, Validator){

		// FORMULAIRE
		$scope.formData = {};
		// IMAGE
		//$scope.formData.image={};
		$scope.validateNumSS= function(id){
			Validator.checkNumSS(id);			
		}
		
		$scope.displayScanTitle= function(){
			if($scope.formData.nationalite!=null){
				if($scope.formData.nationalite =="française")
					$scope.formData.scanTitle="Charger un scan de votre CNI";
				else
					$scope.formData.scanTitle="Chargez un scan de votre autorisation de travail";			
			}			
		}

		$scope.updateCivilite = function(){

			for(var obj in $scope.formData){
				console.log("formData["+obj+"] : "+$scope.formData[obj]);
			}

			var titre=$scope.formData.civ;
			var nom=$scope.formData.nom;
			var prenom=$scope.formData.prenom;
			var dateNaissance=$scope.formData.dateNaissance;
			var numSS=$scope.formData.numSS;
			var nationalite=$scope.formData.nationalite;
			
			// RECUPERATION CONNEXION
			var connexion=$cookieStore.get('connexion');
			// RECUPERATION EMPLOYEUR ID
			var employeId=connexion.employeID;
			console.log("$cookieStore.get(connexion) : "+JSON.stringify(connexion));
			// RECUPERATION SESSION ID
			sessionId=$cookieStore.get('sessionID');

			if(!isNaN(titre) || nom || prenom || dateNaissance || numSS || nationalite){
				if(!nom)
					nom="";
				if(!prenom)
					prenom="";
				if(!dateNaissance)
					dateNaissance="";
				if(!numSS)
					numSS="";
				if(!nationalite)
					nationalite="";

				// UPDATE EMPLOYEUR
				UpdateInServer.updateCiviliteInEmployeur(
					Number(employeId), Number(titre), nom, prenom, dateNaissance, numSS, nationalite, sessionId)
						.success(function (response){

							// DONNEES ONT ETE SAUVEGARDES
							console.log("les donnes ont été sauvegarde");
							console.log("response"+response);

							var employeur=$cookieStore.get('employeur');
							if(!employeur)
								employeur={};

							employeur.civilite=titre;
							employeur.nom=nom;
							employeur.prenom=prenom;
							employeur.dateNaissance=dateNaissance;
							employeur.numSS=numSS;
							employeur.nationalite=nationalite;
							
							console.log("employeur : "+JSON.stringify(employeur));
							// PUT IN SESSION
							$cookieStore.put('employeur', employeur);

						}).error(function (err){
							console.log("error : insertion DATA");
							console.log("error In updateCiviliteInEmployeur: "+err);
						});
			}

			// UPLOAD IMAGE
			if($scope.formData.imageEncode){

				console.log("image name : "+$scope.formData.imageName);
				//console.log("image en base64 : "+$scope.formData.imageEncode);
				console.log("image en base64 : "+$scope.formData.imageEncode);
				// ENVOI AU SERVEUR
				//UploadFile.uploadFile($scope.formData.imageName, $scope.formData.imageEncode.split(',')[1], employeId)
				UploadFile.uploadFile("user_employeur", $scope.formData.imageName, $scope.formData.imageEncode, employeId)
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
			codePostals=$cookieStore.get('zipCodes');
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
								$cookieStore.put('zipCodes', []);
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
							//$cookieStore.put('zipCodes', zipCodes);
							console.log("zipCodes : "+JSON.stringify(zipCodes));
						}).error(function (err){
							console.log("error : LOAD DATA");
							console.log("error in loadZipCodes : "+err);
						});
			}***/

			// REDIRECTION VERS PAGE - ADRESSE PERSONEL

			$state.go('adressePersonel');
		};

    $scope.selectImage = function() {
      document.getElementById('image').click();
    };

		$scope.loadImage=function(img){

			console.log("files.length : "+img.files.length);
			console.log("files[0] : "+img.files[0]);

			function el(id){
				var elem = document.getElementById(id);
				if(typeof elem !== 'undefined' && elem !== null){
					return elem;
				}
			} // Get elem by ID

			if(img.files && img.files[0]){

				var FR= new FileReader();
				FR.onload = function(e){
					// RECUPERE FILE-NAME
					$scope.formData.imageName=img.files[0].name;
					// RECUPERE ENCODAGE-64
					$scope.formData.imageEncode=e.target.result;
				};
				FR.readAsDataURL(image.files[0]);
				//$scope.$apply(function(){});

        FR.onload = function (oFREvent) {
          document.getElementById("uploadPreview").src = oFREvent.target.result;
        };
			}
		};

		$scope.validatElement=function(id){
			Validator.checkField(id);
		};

		$scope.initForm=function(){
			// GET LIST
			$scope.formData={'civilites': DataProvider.getCivilites()};
			$scope.formData.scanTitle="Chargez un scan de votre autorisation de travail";			

		};

		$scope.$on("$ionicView.beforeEnter", function(scopes, states){
			if(states.fromCache && states.stateName == "saisieCiviliteJobeyer"){
				$scope.initForm();

				console.log("Je suis ds $ionicView.beforeEnter(saisieCivilite)");
			  var employeur=$cookieStore.get('employeur');
				console.log("employeur : "+JSON.stringify(employeur));
				if(employeur){
					// INITIALISATION FORMULAIRE
					if(employeur.civilite)
						$scope.formData.civ=employeur.civilite;
					if(employeur.nom)
						$scope.formData.nom=employeur.nom;
					if(employeur.prenom)
						$scope.formData.prenom=employeur.prenom;
					if(employeur.dateNaissance)
						$scope.formData.dateNaissance=employeur.dateNaissance;
					if(employeur.numSS)
						$scope.formData.numSS=employeur.numSS;
					if(employeur.nationalite)
						$scope.formData.nationalite=employeur.nationalite;
				}
			}
		});

		$scope.takePicture = function(){

			console.log("Je suis ds takePicture() ");
			var options = {
				quality: 50,
				destinationType: Camera.DestinationType.DATA_URL,
				sourceType: Camera.PictureSourceType.CAMERA,
				allowEdit: true,
				encodingType: Camera.EncodingType.JPEG,
				targetWidth: 100,
				targetHeight: 100,
				popoverOptions: CameraPopoverOptions,
				saveToPhotoAlbum: false,
				correctOrientation:true
			};

			$cordovaCamera.getPicture(options).then(function(imageData){
				$scope.imgURI = "data:image/jpeg;base64," + imageData;
				console.log("imageData : "+imageData);
			});

			console.log("imgURI : "+$scope.imgURI);
		}
	});
