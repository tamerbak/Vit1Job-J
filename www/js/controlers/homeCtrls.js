/**
 * Created by Tamer on 09/10/2015.
 */
angular.module('homeCtrls', ['ionic','cb.x2js', 'parsingServices'])

  .controller('homeCtrl', function ($scope, $rootScope, $http, $state, x2js, $ionicPopup, $timeout) {

    var jobyersForMe = [];
    var jobyersNextToMe = [];

    $scope.getJobbers = function (query) {

      $rootScope.jobyersForMe = [];
      $rootScope.jobyersNextToMe = [];
      $rootScope.nbJobyersForMe = 0;
      $rootScope.nbJobyersNextToMe = 0;

      $rootScope.queryText = query;

      if (sessionId!=''){
        soapMessage = 'user_salarie;' + query; //'C# sur paris';
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
            jsonText = jsonText.replace("fr.protogen.connector.model.DataModel","dataModel");
            jsonText = jsonText.replace("fr.protogen.connector.model.DataRow","dataRow");
            jsonText = jsonText.replace("fr.protogen.connector.model.DataEntry","dataEntry");
            jsonText = jsonText.replace("fr.protogen.connector.model.DataCouple", "dataCouple");
            jsonResp = JSON.parse(jsonText);

           // var jsonResp = parsingService.formatString.formatServerResult(response.data);

            //Check if there are rows!

            //var rowsCount = jsonResp.dataModel.rows.dataRow.length;
            //if (typeof (jsonResp.dataModel.rows.dataRow.dataRow) == 'undefined') {
            //if (Array.isArray(jsonResp.dataModel.rows.dataRow)){
            if (jsonResp.dataModel.rows.dataRow instanceof Array){
              //if (jsonResp.dataModel.rows.dataRow.length > 0){
              //if (rowsCount > 0){

              for (i = 0; i < jsonResp.dataModel.rows.dataRow.length; i++) {

                jsonText = JSON.stringify (jsonResp);
                jsonText = jsonText.replace("fr.protogen.connector.model.DataModel","dataModel");
                jsonText = jsonText.replace("fr.protogen.connector.model.DataRow","dataRow");
                jsonText = jsonText.replace("fr.protogen.connector.model.DataEntry","dataEntry");
                jsonText = jsonText.replace("fr.protogen.connector.model.DataCouple", "dataCouple");
                jsonResp = JSON.parse(jsonText);

                //jsonResp = parsingService.formatString.formatServerResult(response.data);

                //jsonResp.dataModel.rows.dataRow[0].dataRow.dataEntry[1].value
                var prenom = jsonResp.dataModel.rows.dataRow[i].dataRow.dataEntry[1].value;
                var nom = jsonResp.dataModel.rows.dataRow[i].dataRow.dataEntry[2].value;
                var idVille = jsonResp.dataModel.rows.dataRow[i].dataRow.dataEntry[6].value;


                prenom = prenom.replace("<![CDATA[",'');
                prenom = prenom.replace("]]>",'');
                nom = nom.replace("<![CDATA[",'');
                nom = nom.replace("]]>",'');
                idVille = idVille.replace("<![CDATA[",'');
                idVille = idVille.replace("]]>",'');

                for (j=0; j < jsonResp.dataModel.rows.dataRow[i].dataRow.dataEntry[6].list.dataCouple.length;j++){
                  jsonText = JSON.stringify (jsonResp);
                  jsonText = jsonText.replace("fr.protogen.connector.model.DataCouple", "dataCouple");
                  jsonResp = JSON.parse(jsonText);
                  if (jsonResp.dataModel.rows.dataRow[i].dataRow.dataEntry[6].list.dataCouple[j].id == idVille)
                    break;
                }

                var ville = jsonResp.dataModel.rows.dataRow[i].dataRow.dataEntry[6].list.dataCouple[j].label;
                jobyersForMe.push({
                  'firstName': prenom,
                  'lastName': nom,
                  'city': ville
                });
              }
            } else {
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
            for (i=0; i < jobyersForMe.length ; i++){
              if (jobyersForMe[i].city == myCity) {
                jobyersNextToMe.push({
                  'firstName': jobyersForMe[i].firstName,
                  'lastName': jobyersForMe[i].lastName,
                  'city': jobyersForMe[i].city
                });
              }
            }
            $rootScope.nbJobyersNextToMe= jobyersNextToMe.length;
            $rootScope.jobyersNextToMe = jobyersNextToMe;

            //isConnected = true;
            //if (jobyersForMe.length>0)
            $state.go('search');
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

    $scope.showPopup = function(){
      var myPopup = $ionicPopup.show({
        template: "Adresse de travail est identique à l'adresse du siège social ? <br>",
        title: "<div class='vimgBar'><img src='img/vit1job-mini2.png'></div>",
        //subTitle: 'Aucun Jobyer ne correspond à votre recherche',
        scope: $scope,
        buttons: [
         { text: '<b>Non</b>',
           type: 'button-dark'
         },
         {
         text: '<b>Oui</b>',
         type: 'button-calm',
         onTap: function(e) {

         }
         }
         ]
      });
      myPopup.then(function(res) {
        console.log('Tapped!', res);
      });
      //$timeout(function() {
      //  myPopup.close(); //close the popup after 3 seconds for some reason
      //}, 3000);
    };

  });
