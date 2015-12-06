/**
 * Created by Tamer on 14/10/2015.
 */

'use strict';
starter
  .controller('cMailCtrl', function ($scope, $rootScope, $cookieStore, $state, x2js, AuthentificatInServer, PullDataFromServer,
			formatString, PersistInServer, Global, Validator){

	 // FORMULAIRE
	 $scope.formData = {};
	 $rootScope.jobeyer = {};

     $scope.connexionByMail= function(){

	  var email=$scope.formData.email;
	  var password=$scope.formData.password;

		  console.log("email : "+email);
		  console.log("password : "+password);

	  var isNew=0;
      var msg = [];
      if (isEmpty(email)){
        msg.push("Email");
      }
      if (isEmpty(password)){
        msg.push("Mot de passe");
      }
	  //email validation
	   var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
	   if (!re.test(email))  {
		  console.log("error email");
		Global.showAlertValidation("Veuillez saisir un email valide.");
		return;		  
	  }
      if (msg.length>0){
        Global.missedFieldsAlert(msg);
        return;
      }	  
	  /*
	  if(isEmpty(email) || isEmpty(password)){
		  Global.showAlertValidation("Veuillez saisir tous les champs.");
		  return;
	  }
	  */

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
          console.log("email : "+email);
		  $cookieStore.put('sessionID', sessionId);

          // INTERROGE EMAIL_TABLE
          PullDataFromServer.pullDATA("user_salarie", sessionId, "email", email, email)
            .success(function (resp){
              var data=formatString.formatServerResult(resp);
              console.log(resp);

              var result=data.dataModel.rows;
			  console.log("result : "+result);
              if(typeof result === 'undefined' || result.length<0 || result===""){
				  console.log('Aucune résultat trouvé');
				  // REDIRECTION VERS INSCRIPTION-1 : SAISIE CIVILITE
				  //$state.go("saisieCivilite");
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
									// RECUPERATION ID jobeyer
									var jobeyerId=0;
									if(listEntry[0].attributeReference === 'pk_user_salarie')
										jobeyerId=listEntry[0].value;

									var connexion={'etat': true, 'libelle': 'Se déconnecter', 'jobeyeId': Number(jobeyerId)};
									$cookieStore.put('connexion', connexion);

									// USER REEL - REDIRECTION VERS home
									$state.go("app");
								}
								else	// MOT DE PASSE INCORRECT
									Global.showAlertPassword("Mot de passe incorrect");
							}
						}
					}
			  }

			  console.log("isNew : "+isNew);
			  if(isNew === 1){
				  // SYSTEME VERIFICATION EMAIL
					console.log("email : "+email+" password : "+password+" sessionId : "+sessionId);
				  // PERSIST IN BD - JOBEYER
					PersistInServer.persistInJobeyer
						('', '', 0, 0, 0, '', '', '','', email, password, '', '', sessionId)
							.success(function (response){
								console.log("ID JOBEYER : "+response);

								// RECUPERATION JOBEYER ID
								var jobeyer=formatString.formatServerResult(response);

								if(jobeyer.dataModel.status){// Bind to local storage service
									$cookieStore.remove('connexion');
									connexion={'etat': true, 'libelle': 'Se déconnecter', 'jobeyeId': Number(jobeyer.dataModel.status)};
									$cookieStore.put('connexion', connexion);

									$rootScope.jobeyer.id=Number(jobeyer.dataModel.status);
									$rootScope.jobeyer.email=email;
									$rootScope.jobeyer.password=password;
								}

								Global.showAlertValidation("Bienvenue! Merci de saisir vos informations avant de lancer votre recherche.");
								// PASSWORD INCORRECT - REDIRECTION
								$state.go("saisieCiviliteJobeyer");
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

	 $scope.validatEmail= function(id){
		 Validator.checkEmail(id);
	 }
  });
