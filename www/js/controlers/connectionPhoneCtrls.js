/**
 * Created by Tamer on 14/10/2015.
 */

'use strict';

starter
  .controller('cPhoneCtrl', function ($scope, $rootScope, $cookieStore, $state, x2js, AuthentificatInServer, PullDataFromServer,
				formatString, PersistInServer, LoadList, Global, DataProvider, Validator){

	  // FORMULAIRE
	  $scope.formData = {};
	  $rootScope.employeur = {};

	  $scope.connexionByPhone = function(){

		for(var obj in $scope.formData){
			//console.log("formData["+obj+"] : "+$scope.formData[obj]);
		}

		var phone=$scope.formData.phone;
		var country=$scope.formData.country;
		var password=$scope.formData.password;

		var isNew=0;
       if (isEmpty(password) && isEmpty(phone)){
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
		  $cookieStore.put('sessionID', sessionId);

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

									var connexion={'etat': true, 'libelle': 'Se déconnecter', 'employeID': Number(employeurId)};
									$cookieStore.put('connexion', connexion);

									// USER REEL - REDIRECTION VERS RECHERCHE
									$state.go("search");
								}
								else	// MOT DE PASSE INCORRECT
									Global.showAlertPassword("Mot de passe incorrect");
							}
						}
					}
			  }

			  console.log("isNew : "+isNew);
			  if(isNew === 1){
				  // PERSIST IN BD - EMPLOYEUR
					PersistInServer.persistInEmployeur
						('', '', 0, 0, 0, '', '', '', phone, '', password, '', '', '', '', '', sessionId)
							.success(function (response){
								console.log("ID EMPLOYEUR : "+response);

								// RECUPERATION EMPLOYEUR ID
								var employeur=formatString.formatServerResult(response);

								if(employeur.dataModel.status || employeur.dataModel.status !== 'FAILURE'){	// BIND IN COOKIES
									connexion={'etat': true, 'libelle': 'Se déconnecter', 'employeID': Number(employeur.dataModel.status)};
									$cookieStore.put('connexion', connexion);

									$rootScope.employeur.id=Number(employeur.dataModel.status);
									$rootScope.employeur.phone=phone;
									$rootScope.employeur.country=country;
									$rootScope.employeur.password=password;
								}

								/*** LOAD LIST CIVILITES
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
								}***/

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
     };

		$scope.validatElement=function(id){
			Validator.checkField(id);
		};

		$scope.initForm=function(){
			// GET LIST
			$scope.formData={'pays': DataProvider.getPays()};
			//$scope.formData={ 'villes': $cookieStore.get('villes')};
		};

		$scope.loadCodeInter=function(){
			var code=$scope.formData.country;
			$scope.formData.phone="+"+code+" ";

			/**else if(code==2)
				$scope.formData.phone="+33 ";
			else if(code==3)
				$scope.formData.phone="+1 ";
			else
				$scope.formData.phone="+00 ";**/
		};

		$scope.$on( "$ionicView.beforeEnter", function( scopes, states ){
			if(states.fromCache && states.stateName == "cPhone" ){
				$scope.initForm();
			}
		});
  });
