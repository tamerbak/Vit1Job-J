/**
 * Created by Tamer on 15/10/2015.
 */

'use strict';
starter

	.controller('disponibiliteCtrl', function ($scope, $rootScope, $cookieStore, $state,$ionicHistory, AuthentificatInServer,
						Global, DataProvider, PullDataFromServer, PersistInServer,$ionicPopup){
		// FORMULAIRE
		$scope.formData={'jours':{'lundi':"",'mardi':"",'mercredi':"",'jeudi':"",'vendredi':"",'samedi':"",'dimanche':""}};

    $scope.saveDisponibilite= function(){
      var dateDebut= $scope.formData.dateDebut;
      var dateFin= $scope.formData.dateFin;
      var jamais = $scope.formData.jamais;
      var jours= $scope.formData.jours;
      var remuneration= $scope.formData.remuneration;
    };

    $scope.initAll = function(){

			// GET LIST
			$scope.formData={
            'jours':{'lundi':"",'mardi':"",'mercredi':"",'jeudi':"",'vendredi':"",'samedi':"",'dimanche':""},
            "heures":[]
				};

		};

    $scope.ajouterHeures= function(){
      var hdebut=$scope.formData.heureDebut;
      var hfin=$scope.formData.heureFin;
      var mdebut=$scope.formData.minDebut;
      var mfin=$scope.formData.minFin;

      if(hdebut!="00" && hfin!="00") {
        if(hfin > hdebut)
          $scope.formData.heures.push({"heureDebut": hdebut+"h"+mdebut+"min", "heureFin": hfin+"h"+mfin+"min"});
        else
          Global.showAlertValidation("L'heure de fin doit être supérieur.");
      }else{
        Global.showAlertValidation("Veuillez saisir une heure de début et une heure de fin.");
      }
    };
  });
