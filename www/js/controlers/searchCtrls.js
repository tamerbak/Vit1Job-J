/**
 * Created by Tamer on 09/10/2015.
 */
/**
 * Modified by HODAIKY on 25/10/2015.
 */
'use strict';
starter

  .controller('searchCtrl', function ($scope, $rootScope,$state, $http, x2js) {

    $scope.mfbMenuState = 'open';
    $scope.search = $rootScope.queryText;

    $scope.onSearchChange = function (search) {

      /*$scope.mfbMenuState = 'closed';*/
      var jobyersForMe = [];
      var jobyersNextToMe = [];

      if ( search == ''){
        $rootScope.jobyersForMe = [];
        $rootScope.nbJobyersForMe = 0;
        $rootScope.nbJobyersNextToMe = 0;
        $rootScope.jobyersNextToMe = [];
        $scope.mfbMenuState = 'open';
        return;
      }


      if (sessionId != '') {
        var soapMessage = 'user_salarie;' + search; //'C# sur paris';
        $http({
          method: 'POST',
          url: 'http://ns389914.ovh.net:8080/vit1job/api/recherche',
          headers: {
            "Content-Type": "text/plain"
          },
          data: soapMessage
        }).then(
          function (response) {
            var jsonResp = x2js.xml_str2json(response.data);
            var jsonText = JSON.stringify(jsonResp);
            jsonText = jsonText.replace("fr.protogen.connector.model.DataModel", "dataModel");
            jsonText = jsonText.replace("fr.protogen.connector.model.DataRow", "dataRow");
            jsonText = jsonText.replace("fr.protogen.connector.model.DataEntry", "dataEntry");
            jsonText = jsonText.replace("fr.protogen.connector.model.DataCouple", "dataCouple");
            jsonResp = JSON.parse(jsonText);

            //Check if there are rows!
            if (jsonResp.dataModel.rows.dataRow instanceof Array) {
              for (var i = 0; i < jsonResp.dataModel.rows.dataRow.length; i++) {
                jsonText = JSON.stringify(jsonResp);
                jsonText = jsonText.replace("fr.protogen.connector.model.DataModel", "dataModel");
                jsonText = jsonText.replace("fr.protogen.connector.model.DataRow", "dataRow");
                jsonText = jsonText.replace("fr.protogen.connector.model.DataEntry", "dataEntry");
                jsonText = jsonText.replace("fr.protogen.connector.model.DataCouple", "dataCouple");
                jsonResp = JSON.parse(jsonText);

                //jsonResp.dataModel.rows.dataRow[0].dataRow.dataEntry[1].value
                var prenom = jsonResp.dataModel.rows.dataRow[i].dataRow.dataEntry[1].value;
                var nom = jsonResp.dataModel.rows.dataRow[i].dataRow.dataEntry[2].value;
                var idVille = jsonResp.dataModel.rows.dataRow[i].dataRow.dataEntry[6].value;

                prenom = prenom.replace("<![CDATA[", '');
                prenom = prenom.replace("]]>", '');
                nom = nom.replace("<![CDATA[", '');
                nom = nom.replace("]]>", '');
                idVille = idVille.replace("<![CDATA[", '');
                idVille = idVille.replace("]]>", '');

                for (var j = 0; j < jsonResp.dataModel.rows.dataRow[i].dataRow.dataEntry[6].list.dataCouple.length; j++) {
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
              if (jsonResp.dataModel.rows != "") {
                prenom = jsonResp.dataModel.rows.dataRow.dataRow.dataEntry[1].value;
                nom = jsonResp.dataModel.rows.dataRow.dataRow.dataEntry[2].value;
                idVille = jsonResp.dataModel.rows.dataRow.dataRow.dataEntry[6].value;

                prenom = prenom.replace("<![CDATA[", '');
                prenom = prenom.replace("]]>", '');
                nom = nom.replace("<![CDATA[", '');
                nom = nom.replace("]]>", '');
                idVille = idVille.replace("<![CDATA[", '');
                idVille = idVille.replace("]]>", '');

                for (j = 0; j < jsonResp.dataModel.rows.dataRow.dataRow.dataEntry[6].list.dataCouple.length; j++) {
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
                $rootScope.jobyersForMe = [];
                $rootScope.nbJobyersForMe = 0;
                $rootScope.nbJobyersNextToMe = 0;
                $rootScope.jobyersNextToMe = [];
                $scope.mfbMenuState = 'open';
                return;
              }
            }

            //sessionId = jsonResp.amanToken.sessionId;*/
            //console.log($scope.firstName + " " + $scope.secondName);

            $rootScope.jobyersForMe = jobyersForMe;
            $rootScope.nbJobyersForMe = jobyersForMe.length;

            // Send Http query to get jobbers with same competencies and same city as mine
            for (i = 0; i < jobyersForMe.length; i++) {
              if (jobyersForMe[i].city == myCity) {
                jobyersNextToMe.push({
                  'firstName': jobyersForMe[i].firstName,
                  'lastName': jobyersForMe[i].lastName,
                  'city': jobyersForMe[i].city
                });
              }
            }
            $rootScope.jobyersNextToMe = jobyersNextToMe;
            $rootScope.nbJobyersNextToMe = jobyersNextToMe.length;
            $scope.mfbMenuState = 'open';
          },
          function (response) {
            $rootScope.jobyersForMe = [];
            $rootScope.nbJobyersForMe = 0;
            $rootScope.nbJobyersNextToMe = 0;
            $rootScope.jobyersNextToMe = [];
            $scope.mfbMenuState = 'open';
            alert("Error : " + response.data);
          }
        );
      }
    };

    $scope.isNoJobyerForMe = function() {
      if ($scope.nbJobyersForMe != 0){
        $state.go('list');
      }
    };

    $scope.isNoJobyerNextToMe = function() {
      if ($scope.nbJobyersNextToMe != 0){
        $state.go('listNext');
      }
    }
  })
;
