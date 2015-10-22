/**
 * Created by Omar on 14/10/2015.
 */


angular.module('saisieCiviliteEmployeurCtrls', ['ionic', 'ngOpenFB', 'ngCookies', 'fileServices', 'base64'])

	.controller('saisieCiviliteEmployeurCtrl', function ($scope, $cookieStore, $state, UpdateInServer, UploadFile, $base64){

		// FORMULAIRE
		$scope.formData = {};
		
		$scope.updateCiviliteEmployeur = function(){
		  
			for(var obj in $scope.formData){
				console.log("formData["+obj+"] : "+$scope.formData[obj]);
			}
			
			titre=$scope.formData.titre;
			nom=$scope.formData.nom;
			prenom=$scope.formData.prenom;
			entreprise=$scope.formData.entreprise;
			siret=$scope.formData.siret;
			ape=$scope.formData.ape;
			numUssaf=$scope.formData.numUssaf;

			// RECUPERATION EMPLOYEUR ID
			employeId=$cookieStore.get('employeID');
			console.log("$cookieStore.get : "+$cookieStore.get('employeID'));
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
			$scope.formData={
				'civilites': $cookieStore.get('civilites')};
		}
	})
	
