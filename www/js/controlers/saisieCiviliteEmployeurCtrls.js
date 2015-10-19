/**
 * Created by Omar on 14/10/2015.
 */


angular.module('saisieCiviliteEmployeurCtrls', ['ionic', 'ngOpenFB', 'ngCookies', 'fileServices', 'base64'])

	.controller('saisieCiviliteEmployeurCtrl', function ($scope, $cookieStore, $state, UpdateInServer, UploadFile, $base64){

		$scope.updateCiviliteEmployeur = function(titre, nom, prenom, entreprise, siret, ape, numUssaf){

			//console.log("$scope.myfile : "+myfile);
			//return;
			// RECUPERATION EMPLOYEUR ID

			employeId=$cookieStore.get('employeID');
			console.log("$cookieStore.get : "+$cookieStore.get('employeID'));
			// RECUPERATION SESSION ID
			sessionId=$cookieStore.get('sessionID');
			
			//if(titre.length !==0 && nom !== '' && prenom !== '' && entreprise !== '' && siret !== '' && ape !== '' && numUssaf !== ''){
			if(titre && nom && prenom && entreprise && siret && ape && numUssaf){
			//if (1==2) {
				// UPDATE EMPLOYEUR
				UpdateInServer.updateCiviliteInEmployeur(
					employeId, titre, nom, prenom, entreprise, siret, ape, numUssaf, sessionId)
						.success(function (response){

							// DONNEES ONT ETE SAUVEGARDES
							console.log("les donnes ont été sauvegarde");
							console.log("response"+response);

						}).error(function (err){
							console.log("error : insertion DATA");
							console.log("error In updateCiviliteInEmployeur: "+err);
						});
			}
			
			// REDIRECTION VERS PAGE - ADRESSE PERSONEL
			$state.go('adressePersonel');	
		}
		
		$scope.loadImage=function(files){
			
			console.log("$base64.encode : "+$base64.encode(files[0]));
			/**console.log("contenu : "+document.getElementById('image').files);**/
			//var f = document.getElementById('image').files[0],
			var f = files[0];
			var	r = new FileReader();
			for(fd in f){
				console.log(fd+" : "+f[fd]);
			}
			
			document.getElementById("image").value = "";
		}
		
	})
