/**
 * Created by Tamer on 09/10/2015.
 */
'use strict';

starter

  .controller('homeCtrl', function ($scope, $rootScope, $http, $state, x2js, $ionicPopup, $cookieStore, $timeout, $cookies) {
		// FORMULAIRE
		$scope.formData = {};
		//$scope.formData.connexion= {};

    $scope.getEmployers = function (query) {
		
      var employersForMe = [];

      $rootScope.employersForMe = [];
      $rootScope.nbEmployersForMe = 0;

      $rootScope.queryText = query;

      if (sessionId!=''){
        var soapMessage = 'user_employeur;' + query; //'C# sur paris';
        $http({
          method: 'POST',
          url: 'http://ns389914.ovh.net:8080/vit1job/api/recherche',
          headers: {
            "Content-Type": "text/plain"
          },
          data: soapMessage
        }).then(
          function(response){
			  		console.log("eeeee");

			for(var ii in response)
				console.log(ii+" : "+response[ii]);
            var jsonResp = x2js.xml_str2json(response.data);
			console.log(jsonResp);
            var jsonText = JSON.stringify (jsonResp);
			
            jsonText = jsonText.replace(/fr.protogen.connector.model.DataModel/g,"dataModel");
            jsonText = jsonText.replace(/fr.protogen.connector.model.DataRow/g,"dataRow");
            jsonText = jsonText.replace(/fr.protogen.connector.model.DataEntry/g,"dataEntry");
            jsonText = jsonText.replace(/fr.protogen.connector.model.DataCouple/g, "dataCouple");
            jsonText = jsonText.replace(/<!\[CDATA\[/g, '').replace(/\]\]\>/g,'');
            jsonResp = JSON.parse(jsonText);
						  	console.log("jsonResp : "+jsonText);

            if (jsonResp.dataModel.rows.dataRow instanceof Array){

				console.log("teeeeeeeeeeeeeeesr");
              for (var i = 0; i < jsonResp.dataModel.rows.dataRow.length; i++) {

                var prenom = jsonResp.dataModel.rows.dataRow[i].dataRow.dataEntry[1].value;
                var nom = jsonResp.dataModel.rows.dataRow[i].dataRow.dataEntry[2].value;
                var idVille = jsonResp.dataModel.rows.dataRow[i].dataRow.dataEntry[6].value;


                prenom = prenom.replace("<![CDATA[",'');
                prenom = prenom.replace("]]>",'');
                nom = nom.replace("<![CDATA[",'');
                nom = nom.replace("]]>",'');
                idVille = idVille.replace("<![CDATA[",'');
                idVille = idVille.replace("]]>",'');

                for (var j=0; j < jsonResp.dataModel.rows.dataRow[i].dataRow.dataEntry[6].list.dataCouple.length;j++){
                  jsonText = JSON.stringify (jsonResp);
                  jsonText = jsonText.replace("fr.protogen.connector.model.DataCouple", "dataCouple");
                  jsonResp = JSON.parse(jsonText);
                  if (jsonResp.dataModel.rows.dataRow[i].dataRow.dataEntry[6].list.dataCouple[j].id == idVille)
                    break;
                }

                var ville = jsonResp.dataModel.rows.dataRow[i].dataRow.dataEntry[6].list.dataCouple[j].label;
                employersForMe.push(
					{
						'firstName': prenom,
						'lastName': nom,
						'city': ville
					});
              }
            } else {
				console.log("aaaaaaaaaaaaaaaaaaa");
				
              //One Instance returned or null!
              if (jsonResp.dataModel.rows!=""){
                prenom = jsonResp.dataModel.rows.dataRow.dataRow.dataEntry[1].value;
                nom = jsonResp.dataModel.rows.dataRow.dataRow.dataEntry[2].value;
                idVille = jsonResp.dataModel.rows.dataRow.dataRow.dataEntry[6].value;

                prenom = prenom.replace("<![CDATA[",'');
                prenom= prenom.replace("]]>",'');
                nom = nom.replace("<![CDATA[",'');
                nom = nom.replace("]]>",'');
                idVille = idVille.replace("<![CDATA[",'');
                idVille = idVille.replace("]]>",'');

                for (j=0; j < jsonResp.dataModel.rows.dataRow.dataRow.dataEntry[6].list.dataCouple.length;j++){
                  if (jsonResp.dataModel.rows.dataRow.dataRow.dataEntry[6].list.dataCouple[j].id == idVille)
                    break;
                }

                ville = jsonResp.dataModel.rows.dataRow.dataRow.dataEntry[6].list.dataCouple[j].label;

                employersForMe[0] = {
                  'firstName': prenom,
                  'lastName': nom,
                  'city': ville
                };
              } else {
					var myPopup = $ionicPopup.show({
						template: "Aucun Employeur ne correspond à votre recherche",
						title: "<div class='vimgBar'><img src='img/vit1job-mini2.png'></div>",
						buttons: [
							{
								text: '<b>OK</b>',
								type: 'button-calm' //button-calm
							}
						]
					});				  
              }
            }

            $rootScope.employersForMe = employersForMe;
            $rootScope.nbEmployersForMe = employersForMe.length;
						
			  if ($rootScope.nbEmployersForMe != 0){
				$state.go('list');
			  }		
          },
          function(response){
			  alert(response);
			  for(var i in response)
				console.log("error : " +i+"  : "+response[i]);
          }
        );
      }
    };

    $scope.exitVit = function () {
      navigator.app.exitApp();
    };

	$scope.initConnexion= function(){

		$scope.formData.connexion={'etat': false, 'libelle': 'Se connecter', 'jobeyeId': 0};
		var cnx=$cookieStore.get('connexion');
		if(cnx){
			$scope.formData.connexion=cnx;
			console.log("Jobeyer est connecté");
		}

		console.log("connexion[jobeyeId] : "+$scope.formData.connexion.jobeyeId);
		console.log("connexion[libelle] : "+$scope.formData.connexion.libelle);
		console.log("connexion[etat] : "+$scope.formData.connexion.etat);
	};

	$scope.$on( "$ionicView.beforeEnter", function( scopes, states ) {
        if(states.fromCache && states.stateName == "app" ) {
			$scope.initConnexion();
        }
    });

	$scope.modeConnexion= function(){
		var estConnecte=0;
		var cnx=$cookieStore.get('connexion');
		if(cnx){
			if(cnx.etat){ // IL S'AGIT D'UNE DECONNEXION
				console.log("IL S'AGIT D'UNE DECONNEXION");

				$cookieStore.remove('connexion');
				$cookieStore.remove('sessionID');
				var connexion={'etat': false, 'libelle': 'Se connecter', 'jobeyeId': 0};
				$cookieStore.put('connexion', connexion);

				console.log("New Connexion : "+JSON.stringify($cookieStore.get('connexion')));
				$state.go("connection");
				/*** REMOVE ALL COOKIES
				var cookies = $cookies.getAll();
				angular.forEach(cookies, function (v, k) {
					$cookieStore.remove(k);
				});**/

			}
			else{ // IL S'AGIT D'UNE CONNEXION
				console.log("IL S'AGIT D'UNE CONNEXION");
				$state.go("connection");
			}
		}
		else
			$state.go("connection");
	}

  });
