/**
 * Created by Tamer on 14/10/2015.
 */


angular.module('cPhoneCtrls', ['ionic', 'parsingServices','wsConnectors', 'ngOpenFB', 'ngCookies'])

  .controller('cPhoneCtrl', function ($scope, $cookieStore, $state, x2js, AuthentificatInServer, PullDataFromServer, formatString, PersistInServer, GlobalService, LocalStorageService){

    $scope.connexionByPhone = function(phone, country, password){

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

          // GET SESSION ID
          sessionId = jsonResp.amanToken.sessionId;
          console.log("sessionId : "+sessionId);
          console.log("phone : "+phone);
		  $cookieStore.put('sessionID', sessionId);
		  
          // INTERROGE PHONE_TABLE
          PullDataFromServer.pullDATA("user_employeur", sessionId, "mot_de_passe", phone, phone)
            .success(function (resp){
              data=formatString.formatServerResult(resp);
              console.log(resp);

              result=data.dataModel.rows;
              if(typeof result === 'undefined' || result.length<0 || result===""){
				  console.log('Aucune résultat trouvé');
				  // REDIRECTION VERS INSCRIPTION-1 : SAISIE CIVILITE
				  //$state.go("saisieCivilite");
				  isNew=1;
			  }
			  else{
					// VERIFICATION DU PASSWORD
					var listEntry=[];
					listEntry=result.dataRow.dataRow.dataEntry;

					for(var i=0; i<listEntry.length; i++){
						var object=listEntry[i];

						for (var property in object) {
							if(property === 'attributeReference'){
								if(object[property] === password){
									// USER REEL - REDIRECTION VERS RECHERCHE
									$state.go("search");
								}
								else
									isNew=1;
							}
						}
						//console.log(object);
					}
			  }

			  console.log("isNew : "+isNew);
			  if(isNew === 1){
				  // ID EMPLOYEUR
				  //GlobalService.setEmployeId=0;

				  // SYSTEME VERIFICATION TEL

				  // PERSIST IN BD - EMPLOYEUR
					PersistInServer.persistInEmployeur
						('', '', 0, 0, 0, '', '', phone, '', password, '', '', '', '', '', sessionId)
							.success(function (response){
								console.log("ID EMPLOYEUR : "+response);

								// RECUPERATION EMPLOYEUR ID
								employeur=formatString.formatServerResult(response);

								if(employeur.dataModel.status)	// Bind to local storage service
									$cookieStore.put('employeID', employeur.dataModel.status);
									//$cookies.put('employeID', employeur.dataModel.status);
									//LocalStorageService.setItem('employeID', employeur.dataModel.status);
									//GlobalService.setEmployeId=Number(employeur.dataModel.status);

								console.log("ID EMPLOYEUR : "+GlobalService.setEmployeId);
								// PASSWORD INCORRECT - REDIRECTION
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
  })