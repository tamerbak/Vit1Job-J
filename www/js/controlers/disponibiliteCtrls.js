/**
 * Created by Tamer on 15/10/2015.
 */

'use strict';
starter

	.controller('disponibiliteCtrl', function ($scope, $rootScope, $cookieStore, $state,$ionicHistory, AuthentificatInServer,
						Global, DataProvider, PullDataFromServer, PersistInServer,$ionicPopup){
		// FORMULAIRE
		$scope.formData={};
    $scope.formData.jours=DataProvider.getDays();
    console.log($scope.formData.jours.length);
    $scope.saveDisponibilite= function(){
      var dateDebut= $scope.formData.dateDebut;
      var dateFin= $scope.formData.dateFin;
      var jamais = $scope.formData.jamais;
      var jours= $scope.formData.jours;
      var remuneration= $scope.formData.remuneration;
      var heures=$scope.formData.heures;
      console.log(JSON.stringify($scope.formData));
      if(dateDebut && (dateFin || jamais) && jours && remuneration && !heures.$isEmpty()) {

        // RECUPERATION CONNEXION
        var connexion=$cookieStore.get('connexion');
        // RECUPERATION JOBEYER ID
        var jobeyeId=connexion.jobeyeId;
        // RECUPERATION SESSION ID
        sessionId=$cookieStore.get('sessionID');
        var hasSessionID=0;
        if(sessionId)
          hasSessionID=1;
        else{	// RECUPERATION SESSION-ID
          AuthentificatInServer.getSessionId()
            .success(function (response){
              var jsonResp = x2js.xml_str2json(response);
              var jsonText = JSON.stringify (jsonResp);
              jsonText = jsonText.replace("fr.protogen.connector.model.AmanToken","amanToken");
              jsonResp = JSON.parse(jsonText);

              // GET SESSION ID
              sessionId = jsonResp.amanToken.sessionId;
              console.log("New sessionId : "+sessionId);
              $cookieStore.put('sessionID', sessionId);
              hasSessionID=1;
            })
            .error(function (err){
              console.log("error : Récuperation Session ID");
              console.log("error In saveJobyers: "+err);
            });
        }
        var heure_d=heures[0].heureDebut;
        var heure_f=heures[0].heureFin;
        if(hasSessionID){
          PersistInServer.persistInDisponibilite(jourId, heure_d, heure_f, sessionId, offreId)
            .then(
              function (response){
                console.log("response : "+JSON.stringify(response));

                var myPopup = $ionicPopup.show({
                  template: "Votre compte a été crée avec succés <br>",
                  title: "<div class='vimgBar'><img src='img/vit1job-mini2.png'></div>",
                  buttons: [
                    {
                      text: '<b>OK</b>',
                      type: 'button-calm'
                    }
                  ]
                });
                $state.go("app");
              },function (err){
                console.log("error : insertion DATA");
                console.log("error In PullDataFromServer.pullDATA: "+err);
              }
            );
        }

      }else{
        Global.showAlertValidation("Veuillez saisir tous les champs");
      }

    };

    $scope.initAll = function(){

			// GET LIST
			$scope.formData={
            "heures":[]
				};
      $scope.formData.jours=DataProvider.getDays();
      PullDataFromServer.pullDATA("user_salarie", sessionId, "email", email, email)
        .success(function (resp){
          console.log(JSON.stringify(resp));
        });
		};

    $scope.ajouterHeures= function(){

      var hdebut=$scope.formData.heureDebut;
      var hfin=$scope.formData.heureFin;
      var mdebut=$scope.formData.minDebut;
      var mfin=$scope.formData.minFin;

      if(hdebut!=undefined && hfin!=undefined && mdebut!=undefined && mfin!=undefined) {
        if(hfin > hdebut)
          $scope.formData.heures.push({"heureDebut": hdebut+"h"+mdebut+"min", "heureFin": hfin+"h"+mfin+"min"});
        else
          Global.showAlertValidation("L'heure de fin doit être supérieur.");
      }else{
        Global.showAlertValidation("Veuillez saisir une heure de début et une heure de fin.");
      }
    };

    $scope.supprimerHeures= function(){

      if( $scope.formData.heures.length!=0){
        $scope.formData.heures.pop();
      }
    };
  });
