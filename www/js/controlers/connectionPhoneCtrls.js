/**
 * Created by Tamer on 14/10/2015.
 */


angular.module('cPhoneCtrls', ['ionic', 'parsingServices','wsConnectors', 'ngOpenFB'])

  .controller('cPhoneCtrl', function ($scope, x2js, AuthentificatInServer, PullDataFromServer, formatString){

    $scope.connexionByPhone = function(phone, country, password){

      // CONNEXION AU SERVEUR
      AuthentificatInServer.pullSessionId()
        .success(function (response){

          var jsonResp = x2js.xml_str2json(response);
          var jsonText = JSON.stringify (jsonResp);
          jsonText = jsonText.replace("fr.protogen.connector.model.AmanToken","amanToken");
          jsonResp = JSON.parse(jsonText);

          // GET SESSION ID
          sessionId = jsonResp.amanToken.sessionId;
          console.log("sessionId : "+sessionId);
          console.log("phone : "+phone);

          // INTERROGE PHONE_TABLE
          PullDataFromServer.pullDATA("user_salarie", sessionId, "cin", phone, phone)
            .success(function (resp){
              data=formatString.formatServerResult(resp);
              console.log(data);

              var result=data.dataModel.rows;
              if(typeof result === 'undefined' || result.length<0 || result==="")
                alert('Aucune résultat trouvé');
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
