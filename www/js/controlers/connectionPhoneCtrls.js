/**
 * Created by Tamer on 14/10/2015.
 */

'use strict';

starter
  .controller('cPhoneCtrl', function ($scope, $rootScope, localStorageService, $state, $http,
                                      AuthentificatInServer, LoadList, Global, Validator, DataProvider) {

    $scope.formData = {};
    $scope.isIOS = ionic.Platform.isIOS();
    $scope.isAndroid = ionic.Platform.isAndroid();
    $rootScope.employeur = {};
    localStorageService.remove("steps");
    /*********************New code*********************/
    var OnAuthenticateSuccesss = function (data) {
      if (!data) {
        OnAuthenticateError(data);
        return;
      }
      data = data[0]['value'];
      console.log(data);
      if (data.length == 0) {
        OnAuthenticateError(data);
        return;
      }

      data = JSON.parse(data);

      localStorageService.remove('connexion');
      localStorageService.remove('currentEmployer');
      var connexion = {
        'etat': true,
        'libelle': 'Se déconnecter',
        'employeID': data.jobyerId
      };


      localStorageService.set('connexion', connexion);
      localStorageService.set('currentEmployer', data);
      var isNewUser = data.new;
      if (isNewUser == 'true') {
        Global.showAlertValidation("Bienvenue dans votre espace VitOnJob!");
        $state.go("menu.infoTabs.saisieCiviliteEmployeur");
      } else {
        $state.go("menu.app");
      }
    };

    var OnAuthenticateError = function (data) {
      console.log(data);
      Global.showAlertPassword("Le nom d'utilisateur ou le mot de passe est incorrect");
    };

    $scope.Authenticate = function () {
      var phone = $scope.formData.phone;
      var index = $scope.formData.index;
      var email = $scope.formData.email;
      var password = $scope.formData.password;
      var msg = [];
      var isNew = 0;

      phone = index + phone;

      AuthentificatInServer.Authenticate(email, phone, password, 'jobyer')
        .success(OnAuthenticateSuccesss)
        .error(OnAuthenticateError);
    };
    $scope.displayPwdTooltip = function () {
      $scope.showPwdTooltip = true;
    };
    $scope.displayPwd2Tooltip = function () {
      $scope.showPwd2Tooltip = true;
    };

    $scope.passwordIsValid = function () {
      if ($scope.formData.password != undefined) {
        if (Number($scope.formData.password.length) >= 6) {
          return true;
        }
        else
          return false;
      } else
        return false;
    };

    $scope.password2IsValid = function () {
      return ($scope.formData.password == $scope.formData.password2)
    };

    $scope.displayPhoneTooltip = function () {
      $scope.showPhoneTooltip = true;
    };
    $scope.phoneIsValid = function () {
      console.log($scope.formData.phone);
      if ($scope.formData.phone != undefined) {
        var phone_REGEXP = /^0/;
        var isMatchRegex = phone_REGEXP.test($scope.formData.phone);
        console.log("isMatchRegex = " + isMatchRegex);
        if (Number($scope.formData.phone.length) >= 9 && !isMatchRegex) {
          console.log('test phone');
          return true;
        }
        else
          return false;
      } else
        return false;


    };

    //TEL 23022016 Mail control part
    $scope.validatElement = function (id) {
      Validator.checkField(id);
    };


    $scope.displayEmailTooltip = function () {
      $scope.emailToolTip = 'Veuillez saisir un email valide.';
      $scope.showEmailTooltip = true;
    };

    $scope.validatEmail = function (id) {
      Validator.checkEmail(id);
    };
    $scope.emailIsValid = function () {
      var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
      if (!re.test($scope.formData.email)) {
        return false;
      } else {
        return true;
      }
    };

    $scope.initForm = function () {
      // GET LIST
      //$scope.email = "";
      $scope.libelleButton = "Se connecter";
      $scope.formData.email = "";
      $scope.formData.phone = "";
      $scope.formData.password = "";
      $scope.showEmailField = false;
      if (!$scope.formData)
        $scope.formData = {};
      $scope.formData.index = "33";

      //var pays = localStorageService.get('Countries');
      //if (!pays){
      var listIndicatif = LoadList.loadCountries();
      listIndicatif.success(function (response) {
        console.log(response);
        $scope.formData.pays = response.data;

      }).error(function (error) {
        console.log(error);
      });
      //} else $scope.formData.pays = pays;
    };

    $scope.loadCodeInter = function () {
      var code = $scope.formData.country;
      $scope.formData.phone = "+" + code + " ";

      /**else if(code==2)
       $scope.formData.phone="+33 ";
       else if(code==3)
       $scope.formData.phone="+1 ";
       else
       $scope.formData.phone="+00 ";**/
    };

    /*$scope.$on("$ionicView.beforeEnter", function (scopes, states) {
     if (states.stateName == "cPhone") {
     $scope.initForm();
     }
     });*/

    $scope.$watch('formData.phone', function () {
      if ($scope.formData.phone) {
        $scope.formData.phone = $scope.formData.phone.replace("-", "").replace(".", "").replace("+", "").replace(" ", "").
          replace("(", "").replace(")", "").replace("/", "").replace(",", "").
          replace("#", "").replace("*", "").replace(";", "").replace("N", "");
        if ($scope.formData.phone.length == 10) {
          if ($scope.formData.phone.substring(0, 1) == '0') {
            $scope.formData.phone = $scope.formData.phone.substring(1, 10);
          } else {
            $scope.formData.phone = $scope.formData.phone.substring(0, 9);
          }
        } else if ($scope.formData.phone.length > 10) {
          $scope.formData.phone = $scope.formData.phone.substring(0, 9);
        }
        /*$scope.showEmailField = true;
         $scope.formData.email = "";
         $scope.libelleButton = "Se connecter";*/
        if ($scope.formData.phone.length == 9) {
          $scope.isRegistration();
        }
      }

    });

    $scope.validatePhone = function (tel) {
      $scope.formData.phone = tel.replace("-", "").replace(".", "").replace("+", "").replace(" ", "").
        replace("(", "").replace(")", "").replace("/", "").replace(",", "").
        replace("#", "").replace("*", "").replace(";", "").replace("N", "");

    };
    $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
      viewData.enableBack = true;
    });


    $scope.isRegistration = function () {

      if ($scope.phoneIsValid()) {
        //On teste si le tél existe dans la base
        var tel = "+" + $scope.formData.index + $scope.formData.phone;

        DataProvider.getUserbyPhone(tel).success(function (data) {
          if (!data || data.data.length == 0) {
            $scope.showEmailField = true;
            //$scope.email = "";
            $scope.formData.email = "";
            $scope.libelleButton = "S'inscrire";
          } else {
            //$scope.email = data.data[0]["email"];
            $scope.formData.email = data.data[0]["email"];
            $scope.libelleButton = "Se connecter";
            $scope.showEmailField = false;
          }
        })

      } else {
        //ça sera toujours une connexion
        $scope.showEmailField = true;
        //$scope.email = "";
        $scope.libelleButton = "S'inscrire";
        $scope.formData.email = "";
      }
    };

    $scope.goForAction = function () {

      if ($scope.showEmailField == true) {
        //inscription
        return (!$scope.formData.index || !$scope.formData.phone || !$scope.formData.password
          || !$scope.formData.password2 || !$scope.formData.email) && !$scope.password2IsValid()
      } else {
        //connection
        return (!$scope.formData.index || !$scope.formData.phone || !$scope.formData.password)
      }

    }

  });
