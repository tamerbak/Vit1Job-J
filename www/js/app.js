// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'

'use strict';

//var sessionId = 'nn';
//var myCity = 'Paris';

var starter = angular.module('starter', ['ionic', 'wsConnectors', 'parsingServices', 'fileServices', 'globalServices', 'ng-mfb',
  'cb.x2js', 'ngOpenFB', 'base64', 'ngCordova', 'validationDataServices', 'providerServices',
  'LocalStorageModule', 'connexionPhoneServices', 'Services', 'ngCookies', 'angucomplete-alt', 'ion-google-autocomplete', 'ui.mask',
  'ionic.service.core', 'ionic-multi-date-picker', 'ionic-timepicker', 'ionic-sidetabs'])//, 'ionic-datepicker'

  .run(function ($ionicPlatform, $rootScope, $cordovaSplashscreen, LoadList, localStorageService, $ionicPopup, $state) {
    $ionicPlatform.ready(function () {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      if (window.cordova) {
        setTimeout(function () {
          $cordovaSplashscreen.hide()
        }, 10000);
      }

      if (window.cordova && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        cordova.plugins.Keyboard.disableScroll(true);
      }
      if (window.StatusBar) {
        StatusBar.styleDefault();
      }

      $rootScope.AppLogo = '<div class="vimgBar"><img src="img/vit1job-mini.png"></div>';
      $rootScope.previousView = '';

      /*console.log("Load data...");
       var listIndicatif = LoadList.loadCountries();
       listIndicatif.then(function (response) {
       console.log(response.data[0]);
       console.log(localStorageService.get('Countries'));
       if (response) {
       if (!localStorageService.get('Countries')){
       console.log(response.data);
       localStorageService.set('Countries', response.data);
       }
       }
       console.log("Data loaded!");
       $cordovaSplashscreen.hide();
       })*/

      //Instabug integration :
      if (window.cordova) {
        cordova.plugins.instabug.activate(
          {
            android: '8638bb86054b6354141c9a07d8317d26',
            ios: 'a79265adfebcc922588a989ab0a07557'
          },
          'shake',//button
          {
            commentRequired: true,
            colorTheme: 'dark',
            shakingThresholdAndroid: '0.1',
            shakingThresholdIPhone: '0.5',
            shakingThresholdIPad: '0.6',
            enableIntroDialog: true,
            setLocale: 'french'
          },
          function () {
            console.log('Instabug initialized.');
          },
          function (error) {
            console.log('Instabug could not be initialized - ' + error);
          }
        );
      }


      //ionic push notifications
      var push = new Ionic.Push({
        "debug": true,
        "onNotification": function (notification) {
          var payload = notification.payload;
          localStorageService.set('payload', payload);
          console.log(notification, payload);
          console.log(JSON.stringify(notification));

          var confirmPopup = $ionicPopup.confirm({
            title: "<div class='vimgBar'><img src='img/vit1job-mini2.png'></div>",
            template: 'Veuillez signer votre contrat',
            buttons: [
              {
                text: '<b>Signer</b>',
                type: 'button-dark',
                onTap: function (e) {
                  confirmPopup.close();
                  $state.go("menu.contract");
                }
              }, {
                text: '<b>Annuler</b>',
                type: 'button-calm',
                onTap: function (e) {
                  confirmPopup.close();
                }
              }

            ]
          });


        },
        "onRegister": function (data) {
          console.log(data.token);
        },
        "pluginConfig": {
          "ios": {
            "badge": true,
            "sound": true
          },
          "android": {
            "iconColor": "#343434"
          }
        }
      });

      push.register(function (token) {
        localStorageService.set('deviceToken', token.token);
        console.log("Device token:", token.token);
        push.saveToken(token);  // persist the token in the Ionic Platform
      });

    });
  })
//Remove text from back button and add icon
  .config(function ($ionicConfigProvider) {
    $ionicConfigProvider.backButton.text('').icon('ion-chevron-left');
  })

//Add ionic loading
  .config(function ($httpProvider) {
    $httpProvider.interceptors.push(function ($rootScope) {
      return {
        request: function (request) {
          $rootScope.$broadcast('loading:show');
          return request;
        },
        response: function (response) {
          $rootScope.$broadcast('loading:hide');
          return response;
        }
      }
    });
  })

  .config(['$ionicAppProvider', function ($ionicAppProvider) {

    // Identify app
    $ionicAppProvider.identify({
      // The App ID for the server
      app_id: 'b718e5fc',
      // The API key all services will use for this app
      api_key: 'e25f25053bc85add208fac4c8c42bf3eaf529467847f735b',
      dev_push: false
    });

  }])

  .config(function (ionicTimePickerProvider) {
    var timePickerObj = {
      inputTime: (((new Date()).getHours() * 60 * 60) + ((new Date()).getMinutes() * 60)),
      format: 24,
      step: 1,
      setLabel: 'Ok',
      closeLabel: 'Fermer'
    };
    ionicTimePickerProvider.configTimePicker(timePickerObj);
  })

  /*.config(function (ionicDatePickerProvider) {
   var datePickerObj = {
   inputDate: new Date(),
   setLabel: 'Ok',
   todayLabel: "Aujourd'hui",
   closeLabel: 'Fermer',
   mondayFirst: true,
   weeksList: ["Di", "Lu", "Ma", "Me", "Je", "Ve", "Sa"],
   monthsList: ["Jan", "Fev", "Mars", "Avril", "Mai", "Juin", "Juil", "Août", "Sept", "Oct", "Nov", "Déc"],
   templateType: 'popup',
   from: new Date(1950, 1, 1),
   to: new Date(2018, 8, 1),
   showTodayButton: false,
   dateFormat: 'dd/MM/yyyy',
   closeOnSelect: false,
   disableWeekdays: [6]
   };
   ionicDatePickerProvider.configDatePicker(datePickerObj);
   })*/

  .run(function ($rootScope, $ionicLoading) {
    $rootScope.$on('loading:show', function () {
      $ionicLoading.show({template: 'Chargement'});
    });

    $rootScope.$on('loading:hide', function () {
      $ionicLoading.hide();
    });
  });
//End ionic loadin

/*starter.config(function($httpProvider){
 delete $httpProvider.defaults.headers.common['X-Requested-With'];
 });*/

/**
 * Create module for services
 *
 * @type {module|*}
 */
var services = angular.module('Services', []);

/**
 .config(function($mdGestureProvider ){
	   $mdGestureProvider.skipClickHijack();
  })**/

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

starter.directive('googleplace', function () {
  return {
    require: 'ngModel',
    link: function (scope, element, attrs, model) {
      var options = {
        types: [],
        componentRestrictions: {
          country: 'FR'
        }
      };
      scope.gPlace = new google.maps.places.Autocomplete(element[0], options);

      google.maps.event.addListener(scope.gPlace, 'place_changed', function () {
        var container = document.getElementsByClassName('pac-container');

        angular.element(container).attr('data-tap-disabled', 'true');

        angular.element(container).on("click", function () {
          model.$setViewValue(element.val());
        });
        scope.$apply(function () {
          model.$setViewValue(element.val());
        });
      });
    }
  };
});

starter.directive('groupedRadio', function () {
  return {
    restrict: 'A',
    require: 'ngModel',
    scope: {
      model: '=ngModel',
      value: '=groupedRadio'
    },
    link: function (scope, element, attrs, ngModelCtrl) {
      element.addClass('button');
      element.on('click', function (e) {
        scope.$apply(function () {
          ngModelCtrl.$setViewValue(scope.value);
        });
      });

      scope.$watch('model', function (newVal) {
        element.removeClass('button-green');
        if (newVal === scope.value) {
          element.addClass('button-green');
        }
      });
    }
  };
})

/*starter.directive('uploadfile', function () {
 return {
 restrict: 'A',
 link: function(scope, element) {

 element.bind('click', function(e) {
 console.log("uploadfile clicked");
 angular.element(document.querySelector('#imgFile')).trigger('click');
 });
 }
 };
 });*/
