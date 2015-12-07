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
      $scope.formData.heures.push({"heureDebut":$scope.formData.heureDebut,"heureFin":$scope.formData.heureFin});
    };
  });
