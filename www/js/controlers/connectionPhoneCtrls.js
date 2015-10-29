/**
 * Created by Tamer on 14/10/2015.
 */
/**
 * Modified by HODAIKY on 24/10/2015.
 */
'use strict';
starter
  .controller('cPhoneCtrl',
    function ($scope, localStorageService, $state, $ionicPopup, x2js, AuthentificatInServer, PullDataFromServer,
                                          formatString, PersistInServer, LoadList, Global, Countries){
    // An alert dialog
    $scope.showAlert = function($var) {
        var alertPopup = $ionicPopup.alert({
          title: $var,
          template: 'Refaire la sesie'
        });
    };


	  // FORMULAIRE
	  $scope.formData = {};

	  $scope.connexionByPhone = function(){
      //LOG


      var session = localStorageService.get('sessionID');
		  var phone = $scope.formData.pays.code+$scope.formData.phone;
		  var country = $scope.formData.pays.country;
		  var password = $scope.formData.password;

      console.log(phone);
      console.log(country);
      console.log(password);
      console.log(session);

      // salit had l3jab kan recupiri tel pass session && country
      // reste affaire traitement 3la tel & passeword
/*
		var isNew=0;

      if(isEmpty(phone) || isEmpty(country) || isEmpty(password)) {
        var $msg = 'Tous les champs sont vides. Merci de saisir vos informations pour se connecter ';
        Global.showAlertPassword($msg);
        return;
      }

		// CONNEXION AU SERVEUR
		AuthentificatInServer.getSessionId()
			.success(function (response){

          var jsonResp = x2js.xml_str2json(response);
          var jsonText = JSON.stringify (jsonResp);
          jsonText = jsonText.replace("fr.protogen.connector.model.AmanToken","amanToken");
          jsonResp = JSON.parse(jsonText);

          // PUT SESSION ID
          sessionId = jsonResp.amanToken.sessionId;
          console.log("sessionId : "+sessionId);
		  localStorageService.set('sessionID', sessionId);

          // INTERROGE PHONE_TABLE
          PullDataFromServer.pullDATA("user_employeur", sessionId, "telephone", phone, phone)
            .success(function (resp){
              var data=formatString.formatServerResult(resp);

             var result=data.dataModel.rows;
              if(typeof result === 'undefined' || result.length<=0 || result===""){
				  console.log('Aucune résultat trouvé');
				  // REDIRECTION VERS INSCRIPTION-1 : SAISIE CIVILITE
				  isNew=1;
			  }
			  else{
					// VERIFICATION DU PASSWORD
					var listEntry=[].concat(result.dataRow.dataRow.dataEntry);
					if(listEntry.length > 0){

						for(var i=0; i<listEntry.length; i++){ // AUCUNE RESULTAT
							var object=listEntry[i];
							console.log("object : "+JSON.stringify(object));

                    if(object.attributeReference === 'mot_de_passe'){
                      var pass=object.value;
                      console.log("Mot de pass: "+pass);
                      if(pass === password){
                        // RECUPERATION ID EMPLOYEUR
                        var employeurId=0;
                        if(listEntry[0].attributeReference === 'pk_user_employeur')
                          employeurId=listEntry[0].value;

                        var connexion={'etat': true, 'libelle': 'Déconnexion', 'employeID': Number(employeurId)};
                        localStorageService.set('connexion', connexion);

									// USER REEL - REDIRECTION VERS RECHERCHE
									$state.go("search");
								}
								else	// MOT DE PASSE INCORRECT
									Global.showAlertPassword("Mot de passe incorrect");
							}
						}
					}
			  }
			//return;

			  console.log("isNew : "+isNew);
			  if(isNew === 1){
				  // SYSTEME VERIFICATION TEL

				  // PERSIST IN BD - EMPLOYEUR
					PersistInServer.persistInEmployeur
						('', '', 0, 0, 0, '', '', phone, '', password, '', '', '', '', '', sessionId)
							.success(function (response){
								console.log("ID EMPLOYEUR : "+response);

                    // RECUPERATION EMPLOYEUR ID
                    var employeur=formatString.formatServerResult(response);

								if(employeur.dataModel.status || employeur.dataModel.status !== 'FAILURE'){	// BIND IN COOKIES
                  var connexion={'etat': true, 'libelle': 'Se déconnecter', 'employeID': Number(employeur.dataModel.status)};
									localStorageService.set('connexion', connexion);
								}//localStorageService.set('employeID', );

								// LOAD LIST CIVILITES
              var civilites=localStorageService.get('civilites');
								if(!civilites){
									LoadList.loadListCivilites(sessionId)
										.success(function (response){
											resp=formatString.formatServerResult(response);
											// DONNEES ONT ETE CHARGES
											console.log("les civilites ont été bien chargé");
											var civiliteObjects=resp.dataModel.rows.dataRow;

											// GET CIVILITES
											civilites=[];
											var civilite={}; // civilite.libelle | civilite.id

											var civilitesList=[].concat(civiliteObjects);
											for(var i=0; i<civilitesList.length; i++){
												object=civilitesList[i].dataRow.dataEntry;

												// PARCOURIR LIST PROPERTIES
												civilite[object[0].attributeReference]=object[0].value;
												civilite[object[1].attributeReference]=object[1].value;

												if(civilite)
													civilites.push(civilite);
												civilite={}
											}

											console.log("civilites.length : "+civilites.length);
											// PUT IN SESSION
											localStorageService.set('civilites', civilites);
											console.log("civilites : "+JSON.stringify(civilites));
										}).error(function (err){
											console.log("error : LOAD DATA");
											console.log("error in loadListCivilites : "+err);
										});
								}

								// PASSWORD INCORRECT - INSCRIPTION L2
								$state.go("saisieCiviliteEmployeur");
							}).error(function (err){
								console.log("error : insertion DATA");
								console.log("error : "+err);
							});
			  }
            }).error(function (err){
              console.log("error : récuperation DATA");
              console.log("error : "+err);
            });
        })
        .error(function (data){
          console.log("error : récuperation JSessionId");
        });

      */
    };










		$scope.initForm=function(){
      $scope.pays ='';
      $scope.tel = '';
      sessionId=localStorageService.get('sessionID');
      //if(!sessionId){
      // CONNEXION AU SERVEUR
      AuthentificatInServer.getSessionId()
        .success(function (response){

          var jsonResp = formatString.formatServerResult(response);

          // PUT SESSION ID
          sessionId = jsonResp.amanToken.sessionId;
          console.log("New sessionId : "+sessionId);
          localStorageService.set('sessionID', sessionId);

          // GET LIST OF COUNTRIES
          Countries.getAll(sessionId)
            .success( function (response){
              var resp = formatString.formatServerResult(response);
              console.log("les villes ont été bien chargé");
              var paysObjects = resp.dataModel.rows.dataRow;
              console.log("villeObjects : "+JSON.stringify(paysObjects));
              var result = [];
              for (var i =0; i<paysObjects.length;i++){
                result[i] = {'country':paysObjects[i].dataRow.dataEntry[1].value,
                              'code':paysObjects[i].dataRow.dataEntry[3].value};
                console.log(result[i]);
              }

              localStorageService.set ('countries',result);
              $scope.items = localStorageService.get ('countries');
            });
          //$scope.formData={'villes': DataProvider.getVilles()};
          //$scope.formData={ 'villes': localStorageService.get('villes')};
        })
    };


  })
;

