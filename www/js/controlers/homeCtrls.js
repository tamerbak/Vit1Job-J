/**
 * Created by Tamer on 09/10/2015.
 */
'use strict';

starter

  .controller('homeCtrl', function ($scope, $rootScope, $http, $state, x2js, $ionicPopup, localStorageService, $timeout, $cookies,jobyerService) {
		// FORMULAIRE
		$scope.formData = {};
		//$scope.formData.connexion= {};
    $scope.getEmployers = function (query) {
      var jobyersForMe = [];
      //var jobyersNextToMe = [];

      $rootScope.jobyersForMe = [];
     // $rootScope.jobyersNextToMe = [];
      $rootScope.nbJobyersForMe = 0;
      //$rootScope.nbJobyersNextToMe = 0;

      $rootScope.queryText = query;

      if (sessionId!=''){

        var soapMessage = 'user_salarie;' + query; //'C# sur paris';
        $http({
          method: 'POST',
          url: 'http://ns389914.ovh.net:8080/vit1job/api/recherche',
          headers: {
            "Content-Type": "text/plain"
          },
          data: soapMessage
        }).then(
          function(response){
            var jsonResp = x2js.xml_str2json(response.data);
            var jsonText = JSON.stringify (jsonResp);
            jsonText = jsonText.replace(/fr.protogen.connector.model.DataModel/g,"dataModel");
            jsonText = jsonText.replace(/fr.protogen.connector.model.DataRow/g,"dataRow");
            jsonText = jsonText.replace(/fr.protogen.connector.model.DataEntry/g,"dataEntry");
            jsonText = jsonText.replace(/fr.protogen.connector.model.DataCouple/g, "dataCouple");
            jsonText = jsonText.replace(/<!\[CDATA\[/g, '').replace(/\]\]\>/g,'');
            jsonResp = JSON.parse(jsonText);
            console.log('jsonResp'+ JSON.stringify(jsonResp));

            // var jsonResp = parsingService.formatString.formatServerResult(response.data);

            //Check if there are rows!

            //var rowsCount = jsonResp.dataModel.rows.dataRow.length;
            //if (typeof (jsonResp.dataModel.rows.dataRow.dataRow) == 'undefined') {
            //if (Array.isArray(jsonResp.dataModel.rows.dataRow)){
            if (jsonResp.dataModel.rows.dataRow instanceof Array){
              //if (jsonResp.dataModel.rows.dataRow.length > 0){
              //if (rowsCount > 0){

              for (var i = 0; i < jsonResp.dataModel.rows.dataRow.length; i++) {

                //jsonResp = parsingService.formatString.formatServerResult(response.data);

                //jsonResp.dataModel.rows.dataRow[0].dataRow.dataEntry[1].value
                var prenom = jsonResp.dataModel.rows.dataRow[i].dataRow.dataEntry[8].value;
                var nom = jsonResp.dataModel.rows.dataRow[i].dataRow.dataEntry[7].value;
                var idVille = jsonResp.dataModel.rows.dataRow[i].dataRow.dataEntry[4].value;


                prenom = prenom.replace("<![CDATA[",'');
                prenom = prenom.replace("]]>",'');
                nom = nom.replace("<![CDATA[",'');
                nom = nom.replace("]]>",'');
                idVille = idVille.replace("<![CDATA[",'');
                idVille = idVille.replace("]]>",'');

                for (var j=0; j < jsonResp.dataModel.rows.dataRow[i].dataRow.dataEntry[4].list.dataCouple.length;j++){
                  jsonText = JSON.stringify (jsonResp);
                  jsonText = jsonText.replace("fr.protogen.connector.model.DataCouple", "dataCouple");
                  jsonResp = JSON.parse(jsonText);
                  if (jsonResp.dataModel.rows.dataRow[i].dataRow.dataEntry[4].list.dataCouple[j].id == idVille){
                    console.log(jsonResp.dataModel.rows.dataRow[i].dataRow.dataEntry[4].list.dataCouple.length);
                    var ville = jsonResp.dataModel.rows.dataRow[i].dataRow.dataEntry[4].list.dataCouple[j].label;
                    console.log("ville : "+ville);
                    break;

                  }
                }

                jobyersForMe.push(
                  {
                    'firstName': prenom,
                    'lastName': nom,
                    'city': ville
                  });
              }
            } else {
              //One Instance returned or null!
              if (jsonResp.dataModel.rows!=""){
                prenom = jsonResp.dataModel.rows.dataRow.dataRow.dataEntry[8].value;
                nom = jsonResp.dataModel.rows.dataRow.dataRow.dataEntry[7].value;
                idVille = jsonResp.dataModel.rows.dataRow.dataRow.dataEntry[4].value;

                prenom = prenom.replace("<![CDATA[",'');
                prenom= prenom.replace("]]>",'');
                nom = nom.replace("<![CDATA[",'');
                nom = nom.replace("]]>",'');
                idVille = idVille.replace("<![CDATA[",'');
                idVille = idVille.replace("]]>",'');
                console.log("prenom : "+prenom+" nom : "+nom+" idVille : "+idVille);
                for (j=0; j < jsonResp.dataModel.rows.dataRow.dataRow.dataEntry[4].list.dataCouple.length;j++){
                  if (jsonResp.dataModel.rows.dataRow.dataRow.dataEntry[4].list.dataCouple[j].id == idVille) {
                    ville = jsonResp.dataModel.rows.dataRow.dataRow.dataEntry[4].list.dataCouple[j].label;
                    console.log("ville : "+ville);

                    break;
                  }
                }
                console.log("ville : "+ville);

                jobyersForMe[0] = {
                  'firstName': prenom,
                  'lastName': nom,
                  'city': ville
                };
              } else {
                // An elaborate, custom popup
                /*var myPopup = $ionicPopup.show({
                 template: '',
                 title: 'Résultat',
                 subTitle: 'Aucun Jobyer ne correspond à votre recherche',
                 scope: $scope
                 buttons: [
                 { text: 'Cancel' },
                 {
                 text: '<b>Save</b>',
                 type: 'button-positive',
                 onTap: function(e) {
                 if (!$scope.data.wifi) {
                 //don't allow the user to close unless he enters wifi password
                 e.preventDefault();
                 } else {
                 return $scope.data.wifi;
                 }
                 }
                 },
                 ]
                 });
                 myPopup.then(function(res) {
                 console.log('Tapped!', res);
                 });
                 $timeout(function() {
                 myPopup.close(); //close the popup after 3 seconds for some reason
                 }, 3000);
                 return;*/
              }
            }

            //sessionId = jsonResp.amanToken.sessionId;*/
            //console.log($scope.firstName + " " + $scope.secondName);

            $rootScope.jobyersForMe = jobyersForMe;
            $rootScope.nbJobyersForMe = jobyersForMe.length;

            // Send Http query to get jobbers with same competencies and same city as mine
            /*
            for (i=0; i < jobyersForMe.length ; i++){
              if (jobyersForMe[i].city == myCity) {
                jobyersNextToMe.push({
                  'firstName': jobyersForMe[i].firstName,
                  'lastName': jobyersForMe[i].lastName,
                  'city': jobyersForMe[i].city
                });
              }
            }
            */
            //$rootScope.nbJobyersNextToMe= jobyersNextToMe.length;
            //$rootScope.jobyersNextToMe = jobyersNextToMe;

            //isConnected = true;
            //if (jobyersForMe.length>0)
            if ($scope.nbJobyersForMe != 0){
              $state.go('employersTab.list');
            }
            //$state.go('app');
          },
          function(response){
            alert("Error : "+response.data);
          }
        );
      }
    };


    $scope.exitVit = function () {
      navigator.app.exitApp();
    };

	$scope.initConnexion= function(){

		$scope.formData.connexion={'etat': false, 'libelle': 'Se connecter', 'jobeyeId': 0};
		var cnx=localStorageService.get('connexion');
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
		var cnx=localStorageService.get('connexion');
		if(cnx){
			if(cnx.etat){ // IL S'AGIT D'UNE DECONNEXION
				console.log("IL S'AGIT D'UNE DECONNEXION");

				localStorageService.remove('connexion');
				localStorageService.remove('sessionID');
				var connexion={'etat': false, 'libelle': 'Se connecter', 'jobeyeId': 0};
				localStorageService.put('connexion', connexion);

				console.log("New Connexion : "+JSON.stringify(localStorageService.get('connexion')));
				$state.go("connection");
				/*** REMOVE ALL COOKIES
				var cookies = $cookies.getAll();
				angular.forEach(cookies, function (v, k) {
					localStorageService.remove(k);
				});**/

			}
			else{ // IL S'AGIT D'UNE CONNEXION
				console.log("IL S'AGIT D'UNE CONNEXION");
				$state.go("connection");
			}
		}
		else
			$state.go("connection");
	};
    //****************************************** NEW **********************************//

    //************** Pour les tests********************//
    var currentJobyer = {
      "email":"rachid@test.com",
      "employerId":1,
      "entreprises":[
        {"entrepriseId":1,
          "name":"entreprise1",
          "offers":[
            {"offerId":1,
              "title":"offer1",
              "pricticesJob":[
                {"pricticeJobId":1,
                  "job":"serveur",
                  "level":"Bien"}],
              "pricticesLanguage":[
                {"pricticeLanguageId":1,
                  "language":"Français",
                  "level":"Bien"}]},
            {"offerId":2,
              "title":"offer2",
              "pricticesJob":[
                {"pricticeJobId":3,
                  "job":"java",
                  "level":"Excellent"},
                {"pricticeJobId":2,
                  "job":"serveur",
                  "level":"Excellent"}],
              "pricticesLanguage":[
                {"pricticeLanguageId":2,
                  "language":"Anglais",
                  "level":"Bien"}]
            }]
        }]
    };

  //  localStorageService.set('currentJobyer', currentJobyer)

    //*************************************************//

    var checkIsLogged = function(){
      var currentJobyer = localStorageService.get('currentJobyer');
      var isLogged = (currentJobyer) ? true : false;
      return isLogged;
    };

    $scope.$on('$ionicView.beforeEnter', function(){
      $scope.isLogged = checkIsLogged();
    });

    $scope.logOut = function(){
      localStorageService.remove('currentJobyer');
      $scope.isLogged = false;
      //
      var flesh = angular.element(document.querySelector('.bar .button.back-button'));
      flesh.css('display','none');
    };


    var showAddOfferConfirmPopup = function(job) {
      var confirmPopup = $ionicPopup.confirm({
      title: "<div class='vimgBar'><img src='img/vit1job-mini2.png'></div>",
      template: 'Pour que la recherche soit plus précise, voulez vous créer une offre pour ' + job + '?',
      buttons : [
        {
        text: '<b>Continuer</b>',
        type: 'button-dark',
        onTap: function(e) {
          confirmPopup.close();
          getJobyersOffersByJob(job);
        }
      },{
        text: '<b>Ok</b>',
        type: 'button-calm',
        onTap: function(e){
          confirmPopup.close();
          $state.go("offres");
        }
        }

      ]
    });
    };

    var onGetJobyersOffersByJobSuccess = function(data){
      var jobyersOffers = data;
      localStorageService.set('jobyersOffers',jobyersOffers);
      $state.go("employersTab.list");
    };

    var onError = function(data){
      console.log(data);
    };

    var getJobyersOffersByJob = function(job){
      jobyerService.getJobyersOffersByJob(job).success(onGetJobyersOffersByJobSuccess).error(onError);
    };

    var isEntrepriseOfferByJobExists = function(job){
      if(!job) return;
      var currentJobyer = localStorageService.get('currentJobyer');
      if(!currentJobyer) return;
      var entreprises = currentJobyer.entreprises;
      var found = false;
      if(entreprises && entreprises.length > 0){
        var i = 0;
        var offers = [];
        var pricticesJob = [];
        var j;
        var k;
        while(!found && i < entreprises.length){
          offers = entreprises[i].offers;
          if(offers && offers.length > 0){
            j = 0;
            while(!found && j < offers.length){
              pricticesJob = offers[j].pricticesJob;
              if(pricticesJob && pricticesJob.length > 0){
                k = 0;
                while(!found && k < pricticesJob.length){
                  found = (pricticesJob[k].job && pricticesJob[k].job.toLowerCase() == job.toLowerCase());
                  if(found){
                    var currentOffer = {
                      'id' : offers[j].offerId.toString(),
                      'label' : offers[j].title
                    };
                    localStorageService.set('currentOffer',currentOffer);
                    var currentEntreprise = {
                      'id' : entreprises[i].entrepriseId.toString(),
                      'label' : entreprises[i].name
                    };
                    localStorageService.set('currentEntreprise',currentEntreprise);
                    loadcurrentJobyerEntreprises();
                  }
                  else{
                    k++;
                  }
                }
              }
              if(!found) j++;
            }
          }
          if(!found) i++;
        }
      }
      return found;
    };

    var loadcurrentJobyerEntreprises = function(){
      var currentJobyer = localStorageService.get('currentJobyer');
      if(!currentJobyer) return;
      var currentJobyerEntreprises = currentJobyer.entreprises;
      if(currentJobyerEntreprises && currentJobyerEntreprises.length > 0){
        var entreprises = [];
        var entreprise;
        var offers = [];
        var offer;
        for(var i = 0; i < currentJobyerEntreprises.length; i++){
          offers = [];
          if(currentJobyerEntreprises[i] && currentJobyerEntreprises[i].offers && currentJobyerEntreprises[i].offers.length > 0){
            for(var j = 0; j < currentJobyerEntreprises[i].offers.length; j++){
              offer = {
                'id' : currentJobyerEntreprises[i].offers[j].offerId.toString(),
                'label' : currentJobyerEntreprises[i].offers[j].title
              };
              offers.push(offer);
            }
          }
          entreprise = {
            'id' : currentJobyerEntreprises[i].entrepriseId.toString(),
            'label' : currentJobyerEntreprises[i].name,
            'offers' : offers
          }
          entreprises.push(entreprise);
        }
        localStorageService.set('currentJobyerEntreprises',entreprises);
      }
    }

    $scope.launchSearchForJobyersOffers = function(job){
      localStorageService.set('lastSearchedJob',job);
      localStorageService.remove('currentOffer');
      localStorageService.remove('currentEntreprise');
      localStorageService.remove('currentJobyerEntreprises');
      var isLogged = checkIsLogged();
      if(isLogged){
        if(isEntrepriseOfferByJobExists(job)){
          getJobyersOffersByJob(job);
        }else{
          showAddOfferConfirmPopup(job);
        }
      }
      else{
        getJobyersOffersByJob(job);
      }
    };

  });
