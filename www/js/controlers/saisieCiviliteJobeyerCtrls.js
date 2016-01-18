/**
 * Created by Omar on 14/10/2015.
 */
'use strict';
starter
	.controller('saisieCiviliteJobeyerCtrl', function ($scope, $rootScope, localStorageService, $state,$stateParams, UpdateInServer, UploadFile, $base64,
				LoadList, formatString, DataProvider, Validator, $ionicPopup, $cordovaCamera){

		//go back
		$scope.$on('$ionicView.beforeEnter', function (event, viewData) {
				viewData.enableBack = true;
		});

		// FORMULAIRE
		$scope.formData = {};
		$scope.numSSValide =false;
		$scope.isIOS = ionic.Platform.isIOS();
  		$scope.isAndroid = ionic.Platform.isAndroid();
		// IMAGE
		$scope.formData.image={};
  		$scope.showFileDialog = function() {
  			document.getElementById('image').click();

  		};
		$scope.validateNumSS= function(id){
			Validator.checkNumSS(id,$scope.formData.numSS);
			//$scope.numSSValide =false;
		}
		$scope.displayScanTitle= function(){
			if($scope.formData.nationalite!=null && $scope.formData.nationalite!="Nationalité"){
				if($scope.formData.nationalite.libelle =="Français")
					$scope.formData.scanTitle="CNI";
				else
					$scope.formData.scanTitle="autorisation de travail";
			}
		}
$scope.$on("$ionicView.beforeEnter", function(scopes, states){
  console.log(states.fromCache+"  state : "+states.stateName);
  if(states.stateName == "saisieCiviliteJobeyer" ){
    $scope.disableTagButton = (localStorageService.get('steps')!=null)?{'visibility': 'hidden'}:{'visibility': 'visible'};
    var steps =  (localStorageService.get('steps')!=null) ? JSON.parse(localStorageService.get('steps')) : '';
    if(steps!='')
    {
      $scope.title="Présaisie des informations contractuelles : civilité";
      $scope.isContractInfo=true;
      $ionicPopup.show({
        title: "<div class='vimgBar'><img src='img/vit1job-mini2.png'></div>",
        template: 'Veuillez remplir les données suivantes, elle seront utilisées dans le processus du contractualisation.',
        buttons : [
          {
            text: '<b>OK</b>',
            type: 'button-dark',
            onTap: function(e) {
            }
          }
        ]
      });
    }else{
            $scope.title="Saisie de la civilité";
            $scope.isContractInfo=false;
    }
}
});
		$scope.updateCivilite = function(){

			var titre=$scope.formData.civ;
			var nom=$scope.formData.nom;
			var prenom=$scope.formData.prenom;
			var dateNaissance=$scope.formData.dateNaissance;
			var numSS=$scope.formData.numSS;
			var nationalite='';
			var pk_user_nationalite='';
			console.log($scope.formData['nationalite']);
			if($scope.formData['nationalite'] != null  && $scope.formData['nationalite']!='Nationalité' && $scope.formData['nationalite'] != undefined){
				nationalite=$scope.formData['nationalite'];
				pk_user_nationalite=nationalite.pk_user_nationalite;
			}
			console.log("nationalite : "+pk_user_nationalite);
			// RECUPERATION CONNEXION
			var connexion=localStorageService.get('connexion');
			// RECUPERATION jobyer ID
			var jobyerID=connexion.jobyerID;
			console.log("localStorageService.get(connexion) : "+JSON.stringify(connexion));
			// RECUPERATION SESSION ID
			sessionId=localStorageService.get('sessionID');

			if(!isNaN(titre) || nom || prenom || dateNaissance || numSS || pk_user_nationalite){
				if(!nom)
					nom="";
				if(!prenom)
					prenom="";
				//if(!dateNaissance)
				//	dateNaissance=new Date();

				dateNaissance=new Date(dateNaissance);
				var day = dateNaissance.getDate();
				var monthIndex = dateNaissance.getMonth()+1;
				var year = dateNaissance.getFullYear();
				var dateNaissanceFormatted=year+"-"+monthIndex+"-"+day+" 00:00:00.0";
				if(!numSS)
					numSS="";
				if(!pk_user_nationalite)
					pk_user_nationalite="";
				console.log("dateNaissance : "+dateNaissanceFormatted);
				// UPDATE jobyer
				UpdateInServer.updateCiviliteInJobyer(
					Number(jobyerID), Number(titre), nom, prenom, dateNaissanceFormatted, numSS, pk_user_nationalite, sessionId)
						.success(function (response){

							// DONNEES ONT ETE SAUVEGARDES
							console.log("les donnes ont été sauvegarde");
							console.log("response"+response);

							var jobyer=localStorageService.get('jobyer');
							console.log(jobyer);
							if(jobyer==null)
								jobyer={};

							jobyer.civilite=titre;
							jobyer.nom=nom;
							jobyer.prenom=prenom;
							jobyer.dateNaissance=dateNaissance;
							jobyer.numSS=numSS;
							jobyer.nationalite=$scope.formData.nationalite;
							console.log("jobyer : "+JSON.stringify(jobyer));
							// PUT IN SESSION
							localStorageService.set('jobyer', jobyer);

						}).error(function (err){
							console.log("error : insertion DATA");
							console.log("error In updateCiviliteInjobyer: "+err);
						});
			}

			// UPLOAD IMAGE
			if($scope.formData.imageEncode){

				console.log("image name : "+$scope.formData.imageName);
				//console.log("image en base64 : "+$scope.formData.imageEncode);
				console.log("image en base64 : "+$scope.formData.imageEncode);
				// ENVOI AU SERVEUR
				//UploadFile.uploadFile($scope.formData.imageName, $scope.formData.imageEncode.split(',')[1], jobyerID)
				UploadFile.uploadFile("user_salarie", $scope.formData.imageName, $scope.formData.imageEncode, jobyerID)
					.success(function (response){

						// FILE A ETE BIEN TRANSFERE
						console.log("File est bien uploadé");
						console.log("response : "+response);

					}).error(function (err){
						console.log("error : upload File");
						console.log("error In UploadFile.uploadFile(): "+err);
					});
			}

			$state.go('adressePersonel');
		};
		

	    $scope.selectImage = function() {
	      // navigator.camera.getPicture(onSuccess, onFail,{
	      //   quality : 50,
	      //   sourceType : navigator.camera.PictureSourceType.PHOTOLIBRARY,
	      //   destinationType: Camera.DestinationType.FILE_URI
	      // });
	 
	      	var options = {
	                    quality: 75,
	                    destinationType: Camera.DestinationType.DATA_URL,
	                    sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
	                    allowEdit: false,
	                    encodingType: Camera.EncodingType.JPEG,
	                    targetWidth: 100,
	                    targetHeight: 100
	                };

	      	$cordovaCamera.getPicture(options).then(function(imageData){
					$scope.imgURI = "data:image/jpeg;base64," + imageData;;
					console.log("imageURI : "+$scope.imgURI);
					//$state.go($state.current, {}, {reload: true});

				}, function(err) {
					console.log('An error occured: ' + message);
				});
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
									console.log("test");

				};
				FR.readAsDataURL(image.files[0]);
				//$scope.$apply(function(){});

				FR.onload = function (oFREvent) {
					document.getElementById("uploadPreview").src = oFREvent.target.result;
		          	$scope.imgURI = oFREvent.target.result;
		          	$state.go($state.current, {}, {reload: true});
				};
			}
		};

		$scope.validatElement=function(id){
			Validator.checkField(id);
		};
		$scope.initForm=function(){
			// GET LIST
			$scope.formData={'civilites': DataProvider.getCivilites() , 'nationalites': DataProvider.getNationalites()};
			$scope.formData.scanTitle="autorisation de travail";
			$scope.formData.civ="Titre";
			$scope.formData.nationalite="Nationalité";
		};

		$scope.$on("$ionicView.beforeEnter", function(scopes, states){
			if(states.stateName == "saisieCiviliteJobeyer"){
				$scope.initForm();
			  var jobyer=localStorageService.get('jobyer');
				if(jobyer){
					// INITIALISATION FORMULAIRE
					if(jobyer.civilite)
						$scope.formData.civ=jobyer.civilite;
					if(jobyer.nom)
						$scope.formData.nom=jobyer.nom;
					if(jobyer.prenom)
						$scope.formData.prenom=jobyer.prenom;
					if(jobyer.dateNaissance)
						$scope.formData.dateNaissance=new Date(jobyer.dateNaissance);
					if(jobyer.numSS)
						$scope.formData.numSS=jobyer.numSS;
					if(jobyer.nationalite){

						$scope.formData.nationalite=jobyer.nationalite;
						
						
						}
				}
			}
		});

		$scope.takePicture = function(){

			console.log("Je suis ds takePicture() ");
			var options = {
				quality: 75,
				destinationType: Camera.DestinationType.DATA_URL,
				sourceType: Camera.PictureSourceType.CAMERA,
				allowEdit: false,
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
			}, function(err) {
							console.log("error : "+err);
						});
		};
		$scope.skipDisabled= function(){
		  var jobyer=localStorageService.get('jobyer');
       	  return $scope.isContractInfo && (!jobyer || !jobyer.numSS || !jobyer.nationalite || !jobyer.nom || !jobyer.prenom || !jobyer.dateNaissance || !jobyer.civilite);
		};						
	});
