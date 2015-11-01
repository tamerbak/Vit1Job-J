// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'


var sessionId = 'nn';
var myCity = 'Paris';

angular.module('starter', ['ionic', 'homeCtrls', 'searchCtrls', 'listCtrls', 'listNextCtrls',
                'connectionCtrls', 'cPhoneCtrls', 'cMailCtrls', 'saisieCiviliteEmployeurCtrls',
                'competenceCtrls', 'adressePersonelCtrls','adresseTravailCtrls',
                'wsConnectors', 'parsingServices', 'fileServices', 'globalServices',
                //'ng-mfb', 'cb.x2js', 'ngOpenFB'])
                'ng-mfb', 'cb.x2js', 'ngOpenFB', 'base64', 'ngCordova'])

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
        templateUrl: 'templates/connections.html',
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

      .state('cPhone', {
        url: '/cPhone',
        templateUrl: 'templates/connexionPhone.html',
        controller: 'cPhoneCtrl'
      })

      .state('cMail', {
        url: '/cMail',
        templateUrl: 'templates/connexionMail.html',
        controller: 'cMailCtrl'
      })
      .state('saisieCiviliteEmployeur', {
        url: '/saisieCivilite',
        templateUrl: 'templates/saisieCiviliteEmployeur.html',
        controller: 'saisieCiviliteEmployeurCtrl'
      })

      .state('adresseTravail', {
        url: '/adresseTravail',
        templateUrl: 'templates/adresseTravail.html',
        controller: 'adresseTravailCtrl'
      })

      .state('adressePersonel', {
        url: '/adressePersonel',
        templateUrl: 'templates/adressePersonel.html',
        controller: 'adressePersonelCtrl'
      })

      .state('competence', {
        url: '/competence',
        templateUrl: 'templates/competences.html',
        controller: 'competenceCtrl'
      })
    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/app');
  })
  /**
   .config(function($mdGestureProvider ){
	   $mdGestureProvider.skipClickHijack();
     })**/

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
	return (!str || 0 === str.length || typeof str === 'undefined' || str === null);
}
