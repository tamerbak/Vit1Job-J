/**
 * Created by Tamer on 14/10/2015.
 */


angular.module('cMailCtrls', ['ionic', 'parsingServices','wsConnectors', 'ngOpenFB', 'globalServices'])

  .controller('cMailCtrl', function ($scope, localStorageService, $state, x2js, AuthentificatInServer, PullDataFromServer,
			formatString, PersistInServer, Global) {

      // FORMULAIRE
      $scope.formData = {};

      $scope.connexionByMail= function() {

          email=$scope.formData.email;
          password=$scope.formData.password;

          console.log("email : "+email);
          console.log("password : "+password);

          var isNew = 0;
          //if(isEmpty(email) || isEmpty(password))return;

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
              //$cookieStore.put('sessionID', sessionId);
              localStorageService.set('sessionID', sessionId);

              // INTERROGE PHONE_TABLE
              PullDataFromServer.pullDATA("user_employeur", sessionId, "email", email, email)
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
                            //$cookieStore.put('connexion', connexion);
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

                  console.log("isNew : "+isNew);
                  if(isNew === 1){
                    // ID EMPLOYEUR
                    //GlobalService.setEmployeId=0;

                    // SYSTEME VERIFICATION TEL

                    // PERSIST IN BD - EMPLOYEUR
                    PersistInServer.persistInEmployeur
                      ('', '', 0, 0, 0, '', '', '', email, password, '', '', '', '', '', sessionId)
                        .success(function (response){
                          console.log("ID EMPLOYEUR : "+response);

                          // RECUPERATION EMPLOYEUR ID
                          employeur=formatString.formatServerResult(response);

                          if(employeur.dataModel.status)	// Bind to local storage service
                          {
                            //$cookieStore.remove('connexion');
                            connexion={'etat': true, 'libelle': 'Se déconnecter', 'employeID': Number(employeur.dataModel.status)};
                            //$cookieStore.put('connexion', connexion);
                            localStorageService.set('connexion', connexion);
                          }
                            //$cookieStore.put('employeID', employeur.dataModel.status);

                            //$cookies.put('employeID', employeur.dataModel.status);
                            //LocalStorageService.setItem('employeID', employeur.dataModel.status);
                            //GlobalService.setEmployeId=Number(employeur.dataModel.status);

                          Global.showAlertPassword("Bienvenue! Merci de saisir vos informations avant de lancer votre recherche.");
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
