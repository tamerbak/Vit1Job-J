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
  })

  .directive('reverseGeocode', function () {
    return {
      restrict: 'E',
      template: '<div></div>',
      link: function (scope, element, attrs) {
        var geocoder = new google.maps.Geocoder();
        var latlng = new google.maps.LatLng(attrs.lat, attrs.lng);
        geocoder.geocode({ 'latLng': latlng }, function (results, status) {
          if (status == google.maps.GeocoderStatus.OK) {
            if (results[1]) {
              element.text(results[0].formatted_address);//
            } else {
              element.text('Location not found');
            }
          } else {
            element.text('Geocoder failed due to: ' + status);
          }
        });
      },
      replace: true
    }});


function isEmpty(str) {
	return (!str || 0 === str.length);
}


