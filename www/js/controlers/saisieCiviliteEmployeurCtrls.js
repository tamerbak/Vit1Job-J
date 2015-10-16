/**
 * Created by Omar on 14/10/2015.
 */

angular.module('saisieCiviliteEmployeurCtrls', ['ionic', 'ngOpenFB'])

	.controller('saisieCiviliteEmployeurCtrl', function ($scope, $state, UpdateInServer, GlobalService, LocalStorageService){


		$scope.updateCiviliteEmployeur = function(titre, nom, prenom, entreprise, siret, ape, numUssaf){

			// RECUPERATION EMPLOYEUR ID
			//var employeId=$cookies.get('employeID');
			//console.log("employeId : "+employeId);
			//return;

			//if(titre !== '' && nom !== '' && prenom !== '' && entreprise !== '' && siret !== '' && ape !== '' && numUssaf !== ''){
      if (1==2) {
				// UPDATE EMPLOYEUR
				UpdateInServer.updateCiviliteInEmployeur(
					employeId, titre, nom, prenom, entreprise, siret, ape, numUssaf, sessionID)
						.success(function (response){

							// DONNEES SAUVEGARDES
							// REDIRECTION VERS PAGE - ADRESSE PERSONELLE
							$state.go("adressePersonel");

						}).error(function (err){
							console.log("error : insertion DATA");
							console.log("error In updateCiviliteInEmployeur: "+err);
						});
			}
			else{
        $state.go('adressePersonel');
				//console("$scope : "+$scope);
			}
		}
	})
