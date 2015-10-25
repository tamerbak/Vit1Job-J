'use strict';
var sessionId = 'nn';
var myCity = 'Paris';

var starter = angular.module('starter', ['ionic','LocalStorageModule','adresseTravailCtrls','connexionPhoneServices',
                'wsConnectors', 'parsingServices', 'fileServices', 'globalServices',
                //'ng-mfb', 'cb.x2js', 'ngOpenFB'])
                'ng-mfb', 'cb.x2js', 'ngOpenFB', 'base64', 'ngCordova']).run(function($ionicPlatform, $rootScope, $http, x2js, ngFB) {
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

  // this control will be deleted because there will be no Profile page ..
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

/*document.addEventListener("exitButton", function(){
  navigator.notification.confirm(
    'Do you want to quit',
    onConfirmQuit,
    'QUIT TITLE',
    'OK,Cancel'
  );
}, true);*/


function isEmpty(str) {
	return (!str || 0 === str.length);
}
