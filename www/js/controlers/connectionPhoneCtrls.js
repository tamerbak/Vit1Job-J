/**
 * Created by Tamer on 14/10/2015.
 */

'use strict';

starter
  .controller('cPhoneCtrl', function ($scope, $rootScope, localStorageService, $state, x2js, AuthentificatInServer, PullDataFromServer,
				formatString, PersistInServer, LoadList, Global, DataProvider, Validator,$http){

	  $scope.formData = {};
    $scope.isIOS = ionic.Platform.isIOS();
    $scope.isAndroid = ionic.Platform.isAndroid();    
	  $rootScope.jobyer = {};
    localStorageService.remove("steps");

    $scope.Authenticate = function () {
      var phone=$scope.formData.phone;
	  var index=$scope.formData.index;
      var password=$scope.formData.password;
      var msg = [];
      var isNew=0;

      if (isEmpty(index)){
        msg.push("Indicatif");
      }
      if (isEmpty(phone)){
        msg.push("Téléphone");
      }
      if (isEmpty(password)){
        msg.push("Mot de passe");
      }
      if (msg.length>0){
        Global.missedFieldsAlert(msg);
        return;
      }

      phone = index + phone;

     var jsonObj = {"email": "",
        "telephone": btoa(JSON.stringify(phone)), "password": btoa(JSON.stringify(password)),
        "role": btoa(JSON.stringify("jobyer"))};
      var user = jsonObj;
      var userObj = AuthentificatInServer.AuthenticateUser(user);

      if (userObj == null) {
        Global.showAlertPassword("Nom d'utilisateur ou mot de passe incorrect");
      }
      else {
        localStorageService.remove('connexion');
        var connexion = {
          'etat': true,
          'libelle': 'Se déconnecter',
          'jobyerID': userObj.jobyerId
        };
        localStorageService.set('connexion', connexion);
        localStorageService.set('currentJobyer', userObj);
        var isNewUser = userObj.isNew;
        if (isNewUser) {
          Global.showAlertValidation("Bienvenue ! vous êtes rentré dans votre espace VitOnJob sécurisé.");
          $state.go("saisieCiviliteJobeyer");
        } else {
          $state.go("app");
        }
      }
    };
    $scope.displayPwdTooltip = function() {
      $scope.showPwdTooltip = true;
    };
    $scope.passwordIsValid= function(){
      if($scope.formData.password!=undefined) {
        if (Number($scope.formData.password.length) >= 6) {
          return true;
        }
        else
          return false;
      }else
        return false;
    };
    $scope.displayPhoneTooltip = function() {
      $scope.showPhoneTooltip = true;
    };
    $scope.phoneIsValid= function(){
      if($scope.formData.phone!=undefined) {
        var phone_REGEXP = /^0/;
        var isMatchRegex = phone_REGEXP.test($scope.formData.phone);
        if (Number($scope.formData.phone.length) >= 9 && !isMatchRegex) {
          return true;
        }
        else
          return false;
      }else
        return false;
    };

		$scope.validatElement=function(id){
			Validator.checkField(id);
		};

		$scope.initForm=function(){
			// GET LIST
      if(!$scope.formData)
        $scope.formData={};
      $scope.formData.index="33";
      $http.get("http://ns389914.ovh.net:8080/VitOnJob/rest/common/pays/getAll")
        .success(function(data) {
          $scope.formData.pays=data;

        }).error(function(error) {
          console.log(error);
        });
			//$scope.formData={ 'villes': $cookieStore.get('villes')};
		};

		$scope.loadCodeInter=function(){
			var code=$scope.formData.country;
			$scope.formData.phone="+"+code+" ";

			/**else if(code==2)
				$scope.formData.phone="+33 ";
			else if(code==3)
				$scope.formData.phone="+1 ";
			else
				$scope.formData.phone="+00 ";**/
		};

		$scope.$on( "$ionicView.beforeEnter", function( scopes, states ){
			if(states.stateName == "cPhone" ){
				$scope.initForm();
			}
		});

    $scope.$watch('formData.phone', function(){
      if ($scope.formData.phone){
        $scope.formData.phone = $scope.formData.phone.replace("-","").replace(".","").replace("+","").replace(" ","").
        replace("(","").replace(")","").replace("/","").replace(",","").
        replace("#","").replace("*","").replace(";","").replace("N","");
        if ($scope.formData.phone.length == 10){
          if ($scope.formData.phone.substring(0, 1) == '0'){
            $scope.formData.phone = $scope.formData.phone.substring(1,10);
          } else {
            $scope.formData.phone = $scope.formData.phone.substring(0,9);
          }
        } else if ($scope.formData.phone.length > 10) {
          $scope.formData.phone = $scope.formData.phone.substring(0,9);
        }
      }


    });

    $scope.validatePhone = function(tel){
      $scope.formData.phone = tel.replace("-","").replace(".","").replace("+","").replace(" ","").
      replace("(","").replace(")","").replace("/","").replace(",","").
      replace("#","").replace("*","").replace(";","").replace("N","");

    };
  });
