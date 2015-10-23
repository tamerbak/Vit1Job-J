/**
 * Created by Tamer on 14/10/2015.
 */


angular.module('cPhoneCtrls', ['ionic', 'parsingServices','wsConnectors', 'ngOpenFB', 'ngCookies', 'globalServices'])

  .controller('cPhoneCtrl', function ($scope, $cookieStore, $state, x2js, AuthentificatInServer, PullDataFromServer,
				formatString, PersistInServer, LoadList, Global){

	  // FORMULAIRE
	  $scope.formData = {};

	  $scope.connexionByPhone = function(){

		for(var obj in $scope.formData){
			console.log("formData["+obj+"] : "+$scope.formData[obj]);
		}

		phone=$scope.formData.phone;
		country=$scope.formData.country;
		password=$scope.formData.password;

		var isNew=0;
		if(isEmpty(phone) || isEmpty(country) || isEmpty(password))
			return;

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
		  $cookieStore.put('sessionID', sessionId);

          // INTERROGE PHONE_TABLE
          PullDataFromServer.pullDATA("user_employeur", sessionId, "telephone", phone, phone)
            .success(function (resp){
              data=formatString.formatServerResult(resp);

              result=data.dataModel.rows;
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
								pass=object.value;
								console.log("Mot de pass: "+pass);
								if(pass === password){
									// RECUPERATION ID EMPLOYEUR
									employeurId=0;
									if(listEntry[0].attributeReference === 'pk_user_employeur')
										employeurId=listEntry[0].value;

									connexion={'etat': true, 'libelle': 'Se déconnecter', 'employeID': Number(employeurId)};
									$cookieStore.put('connexion', connexion);

									// USER REEL - REDIRECTION VERS RECHERCHE
									$state.go("search");
								}
								else					// MOT DE PASSE INCORRECT
									Global.showAlertPassword("Mot de passe incorrect");
									//console.log("Mot de pass Incorrect");
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
								employeur=formatString.formatServerResult(response);

								if(employeur.dataModel.status || employeur.dataModel.status !== 'FAILURE'){	// BIND IN COOKIES
									connexion={'etat': true, 'libelle': 'Se déconnecter', 'employeID': Number(employeur.dataModel.status)};
									$cookieStore.put('connexion', connexion);
								}//$cookieStore.put('employeID', );

								// LOAD LIST CIVILITES
								civilites=$cookieStore.get('civilites');
								if(!civilites){
									LoadList.loadListCivilites(sessionId)
										.success(function (response){
											resp=formatString.formatServerResult(response);
											// DONNEES ONT ETE CHARGES
											console.log("les civilites ont été bien chargé");
											civiliteObjects=resp.dataModel.rows.dataRow;

											// GET CIVILITES
											civilites=[];
											civilite={}; // civilite.libelle | civilite.id

											civilitesList=[].concat(civiliteObjects);
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
											$cookieStore.put('civilites', civilites);
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
     }

		$scope.initForm=function(){
			// GET LIST
			$scope.formData={
				'villes': $cookieStore.get('villes')};
		}

		$scope.loadCodeInter=function(){
			code=$scope.formData.country;
			if(code==1)
				$scope.formData.phone="+212 ";
			else if(code==2)
				$scope.formData.phone="+33 ";
			else if(code==3)
				$scope.formData.phone="+1 ";
			else
				$scope.formData.phone="+00 ";
		}

		$scope.$on( "$ionicView.beforeEnter", function( scopes, states ){
			if(states.fromCache && states.stateName == "cPhone" ){
				$scope.initForm();
			}
		});
  })
