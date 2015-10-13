// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'


var sessionId = 'nn';
var myCity = 'Paris';

angular.module('starter', ['ionic','ng-mfb','cb.x2js', 'ngOpenFB'])

  .run(function($ionicPlatform, $rootScope, $http, x2js, ngFB) {
  ngFB.init({appId: '426767167530378'});
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }

    $rootScope.jobyersForMe = [];
    $rootScope.jobyersNextToMe = [];
    $rootScope.nbJobyersForMe = 0;
    $rootScope.nbJobyersNextToMe = 0;
    $rootScope.queryText = '';

    //connecting to WS
    /*var soapMessage='<fr.protogen.connector.model.AmanToken>'+
      '<username>administrateur</username>'+
      '<password>1234</password>'+
      '<nom></nom>'+
      '<appId>FRZ48GAR4561FGD456T4E</appId>'+
      '<sessionId></sessionId>'+
      '<status></status>'+
      '<id>0</id>'+
      '<beanId>0</beanId>'+
      '</fr.protogen.connector.model.AmanToken>';

    $http({
      method: 'POST',
      url: 'http://ns389914.ovh.net:8080/vit1job/api/aman',
      headers: {
        "Content-Type": "text/xml"
      },
      data: soapMessage
    }).then(
      function(response){
        var jsonResp = x2js.xml_str2json(response.data);
        var jsonText = JSON.stringify (jsonResp);
        jsonText = jsonText.replace("fr.protogen.connector.model.AmanToken","amanToken");
        jsonResp = JSON.parse(jsonText);

        //console.log(jsonResp.amanToken.sessionId);
        sessionId = jsonResp.amanToken.sessionId;

        //isConnected = true;
        //$state.go('search');
      },
      function(response){
        alert("Error : "+response.data);
        jobbers = 'requete echoué !';
      }
    );*/

  });
})

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
  })

  .controller('searchCtrl', function ($scope, $rootScope,$state, $http, x2js) {

    $scope.mfbMenuState = 'open';
    $scope.search = $rootScope.queryText;
    /*$scope.jobbersForMe = $rootScope.jobyersForMe;
    $scope.nbJobbersForMe = $rootScope.jobyersForMe.length;
    $scope.jobbersNextToMe = $rootScope.jobyersNextToMe;
    $scope.nbJobbersNextToMe = $rootScope.jobyersNextToMe.length;*/

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
        soapMessage = 'user_salarie;' + search; //'C# sur paris';
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
              for (i = 0; i < jsonResp.dataModel.rows.dataRow.length; i++) {
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

                for (j = 0; j < jsonResp.dataModel.rows.dataRow[i].dataRow.dataEntry[6].list.dataCouple.length; j++) {
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

  .controller('listCtrl', function ($scope, $rootScope) {
    $scope.jobyersForMe = $rootScope.jobyersForMe;

  })

  .controller('listNextCtrl', function ($scope, $rootScope) {
    $scope.jobyersNextToMe = $rootScope.jobyersNextToMe;
    /*$scope.styles=[{'background-color':'blue'},{'background-color':'red'}];*/
  })

  .controller('connectCtrl', function ($scope,$state, ngFB) {
    $scope.fbLogin = function () {
      ngFB.login({scope: 'email'}).then(
        function (response) {
          if (response.status === 'connected') {
            console.log('Facebook login succeeded');
            $state.go('profile');
          } else {
            alert('Facebook login failed');
          }
        });
    };
  })

  .controller('ProfileCtrl', function ($scope, ngFB) {
    ngFB.api({
      path: '/me',
      params: {fields: 'id,name'}
    }).then(
      function (user) {
        $scope.user = user;
      },
      function (error) {
        alert('Facebook error: ' + error.error_description);
      });
  })

  .config(function($stateProvider, $urlRouterProvider) {
    $stateProvider

      .state('app', {
        url: '/app',
        templateUrl: 'templates/home.html',
        controller: 'homeCtrl'
      })

      .state('search', {
        url: '/search',
        templateUrl: 'templates/search.html',
        controller: 'searchCtrl'

      })

      .state('connection', {
        url: '/connection',
        templateUrl: 'templates/Connection.html',
        controller: 'connectCtrl'

      })

      .state('profile', {
        url: "/profile",
        templateUrl: "templates/profile.html",
        controller: "ProfileCtrl"
      })

      .state('list', {
        url: '/list',
        templateUrl: 'templates/listJobyers.html',
        controller: 'listCtrl'

      })

      .state('listNext', {
        url: '/listNext',
        templateUrl: 'templates/listJobyersNext.html',
        controller: 'listNextCtrl'

      })

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/app');
  })

  .directive('ngEnter', function() {
    return function(scope, element, attrs) {
      element.bind("keydown keypress", function(event) {
        if(event.which === 13) {
          scope.$apply(function(){
            scope.$eval(attrs.ngEnter);
          });

          event.preventDefault();
        }
      });
    };
  });

document.addEventListener("exitButton", function(){
  navigator.notification.confirm(
    'Do you want to quit',
    onConfirmQuit,
    'QUIT TITLE',
    'OK,Cancel'
  );
}, true);

function onConfirmQuit(button){
  if(button == "1"){
    navigator.app.exitApp();
  }
}
