'use strict';

starter.controller('employersListCtrls',
	['$scope', 'localStorageService', '$ionicActionSheet', 'UserService', '$state','Global','$cordovaSms',
	function($scope, localStorageService, $ionicActionSheet, UserService, $state,Global,$cordovaSms) {
    localStorageService.remove("steps");
      $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
    		viewData.enableBack = true;
            init();
		});
		var init = function(){

			$scope.OfferLabel = capitalize(localStorageService.get('lastSearchedJob'));
			$scope.employerListSetting = localStorageService.get('employerListSetting');
			if(!$scope.employerListSetting){
				$scope.employerListSetting = {
					orderByAvialability : false,
					orderByCorrespondence : false,
					job : 50,
					qi : 25,
					language : 25,
					transportationmode : 'driving'
				};
				localStorageService.set('employerListSetting', $scope.employerListSetting);
			};

			//*/

			$scope.employersOffers = [{
        		employerName : 'Jérôme',
        		employerLastName :'Didier',
        		entreprise:'Softbrain-IT',
        		adresseTravail:{
        				fullAddress:"190 Rue de Copenhague, 93290 Tremblay-en-France"
        		},
				availability : {
					value : 210,
					text : '8h 30min'
				},
				tel: "+212676109994",
				email:"ettebaa.marouane@gmail.com",
				matching : 60,
				contacted : false,
				latitude : 0,
				longitude : 0,
				date_invit : ''
			},
			{
        		employerName : 'Alain',
        		employerLastName :'Didier',
        		entreprise:'Softbrain-IT',
         		adresseTravail:{
        				fullAddress:"190 Rue de Copenhague, 93290 Tremblay-en-France"
        		},
				availability : {
					value : 20,
					text : '3h 30min'
				},
				tel: "+212623628174",
				email:"hanane.aitamhira@gmail.com",
				matching : 20,
				contacted : true,
				latitude : 0,
				longitude : 0,
				date_invit: '19-01-2016  11:20'
			},
			{
        		employerName : 'Philippe',
        		employerLastName :'Didier',
        		entreprise:'Softbrain-IT',
        		adresseTravail:{
        				fullAddress:"190 Rue de Copenhague, 93290 Tremblay-en-France"
        		},
        		availability : {
					value : 1000,
					text : '17h 30min'
				},
				tel: "+212623628174",
				email:"hanane.aitamhira@gmail.com",
				matching : 10,
				contacted : false,
				latitude : 0,
				longitude : 0,
				date_invit: '',
			}];
		//*/
		/*
		$scope.employersOffers = localStorageService.get('employersOffers');
		//*/

		$scope.transportationmode = $scope.employerListSetting.transportationmode;

		$scope.sort();
	};

	$scope.sort = function(){
		if($scope.employerListSetting.orderByCorrespondence) $scope.SortOrder = '-matching';
		if($scope.employerListSetting.orderByAvialability) $scope.SortOrder = '+availability.value';
	};

	var capitalize = function(st) {
		return st.charAt(0).toUpperCase() + st.slice(1);
	};

	var setEmployerListSetting = function(property, newValue){
		var employerListSetting = localStorageService.get('employerListSetting');
    employerListSetting[property] = newValue;
		localStorageService.set('employerListSetting', employerListSetting);
	};

	$scope.$watch('employerListSetting.orderByAvialability', function (newValue, oldValue) {
		setEmployerListSetting('orderByAvialability', newValue);
	});

	$scope.$watch('employerListSetting.orderByCorrespondence', function (newValue, oldValue) {
		setEmployerListSetting('orderByCorrespondence', newValue);
	});
	function has(object, key) {
      return object ? hasOwnProperty.call(object, key) : false;
   	}
	$scope.showMenuForContract = function(selectedemployer){

    	localStorageService.remove('SelectedEmployer');
    	localStorageService.set('SelectedEmployer',selectedemployer);
		var hideSheet = $ionicActionSheet.show({
			buttons: [
			{ text: '<i class="ion-android-textsms"> Contacter par SMS</i>' }, //Index = 0
			{ text: '<i class="ion-android-mail"> Contacter par Mail</i>' }, //Index = 1
			{ text: '<i class="ion-ios-telephone"> Contacter par Téléphone</i>' }, //Index = 2
			{ text: '<i class="ion-ios-paper-outline"> Créer un contrat</i>' } //Index = 3
			],
			titleText: 'Mise en relation',
			cancelText: 'Annuler',
			cssClass: (ionic.Platform.isAndroid()?'android-sheet-vitonjob':'ios-sheet-vitonjob'),
			buttonClicked: function(index) {


		if(index==0){
              // console.log('called send sms');
              document.addEventListener("deviceready", function() {
              var options = {
                  replaceLineBreaks: false, // true to replace \n by a new line, false by default
                  android: {
                    intent: 'INTENT'
                 }
             };
            $cordovaSms.send(selectedemployer.tel, 'Vitojob :Inivitation de mise en relation', options)
                .then(function() {
											selectedemployer.contacted = true;
											selectedemployer.date_invit = new Date();
                }, function(error) {
                      // console.log('Message Failed:' + error);

                    });
                   });
            }
		if(index==1){
				cordova.plugins.email.isAvailable(
					function (isAvailable) {
					selectedemployer.contacted = true;
					selectedemployer.date_invit = new Date();
					cordova.plugins.email.open({
					to:  [selectedemployer.email], // email addresses for TO field
					subject:    "Vitojob :Inivitation de mise en relation", // subject of the email
					//app: 'gmail'
					}, function(){

							//Global.showAlertValidation("Votre email a été bien envoyé.");
					}, this);
					}
				);
		}
		if(index==2){

			window.plugins.CallNumber.callNumber(function(){
				selectedemployer.contacted = true;
				selectedemployer.date_invit = new Date();
			}, function(){
				// console.log("error call");
				Global.showAlertValidation("Une erreur est survenue.Veuillez réssayer plus tard");
			} ,selectedemployer.tel, false);
		}
        //branchement de la page de contrat ou infos clients
          if(index==3){
            /*
              recuperation des données de l'emplyeur et calcule dans une variable boolean
              si toutes les informations sont présentes
              */

              var isAuth = UserService.isAuthenticated();
              if (isAuth) {
								selectedemployer.contacted = true;
								selectedemployer.date_invit = new Date();
                var jobyer = localStorageService.get('jobyer');
                var redirectToStep1 = (typeof (jobyer) == "undefined");
                var redirectToStep1 = (jobyer) ? (typeof (jobyer.civilite) == "undefined") : true;
                var redirectToStep2 = (jobyer) ? (jobyer.adressePersonel==null) : true;
                var redirectToStep3 = (jobyer) ? (jobyer.adresseTravail==null) : true;

                if (has(jobyer.adressePersonel,'fullAddress')) { var redirectToStep2 = false }else {var redirectToStep2 = true};
                if (has(jobyer.adresseTravail,'fullAddress')) { var redirectToStep3 = false }else {var redirectToStep3 = true};
                if (jobyer) {
	                for (var key in jobyer) {

		                redirectToStep1 = (jobyer[key] == "" || jobyer[key] == null || typeof(jobyer[key]) == undefined);
		                if (redirectToStep1) break;
			        }

	                // for (var key in jobyer.adressePersonel) {
	                // 	console.log(key+" : "+jobyer.adressePersonel[key]);
	                //   redirectToStep2 =((jobyer.adressePersonel[key]) == "");
	                //   if (redirectToStep2) break;
	                // }


	                // for (var key in jobyer.adresseTravail) {
	                //   redirectToStep3 = ((jobyer.adresseTravail[key]) == "");
	                //   if (redirectToStep3) break;
	                // }

                }

                var dataInformed = ((!redirectToStep1) && (!redirectToStep2) && (!redirectToStep3));
                var objRedirect = {"state":false,"step1": redirectToStep1, "step2": redirectToStep2, "step3": redirectToStep3};
                if (dataInformed) {
                	objRedirect.state=false;
                  localStorageService.set("steps",objRedirect);
                  //show contract page //TODO
                  $state.go("contract", {"selectedEmployer": selectedemployer});
                  // console.log(selectedemployer);
                  // console.log("redirect to contract pages");
                }
                else {
                	objRedirect.state=true;
                  localStorageService.set("steps",objRedirect);
                  // console.log( localStorageService.get("steps"));
                  if (redirectToStep1) $state.go("saisieCiviliteJobeyer", {"selectedEmployer": selectedemployer});
                  else if (redirectToStep2) $state.go("adressePersonel", {"selectedEmployer": selectedemployer});
                  else if (redirectToStep3) $state.go("adresseTravail", {"selectedEmployer": selectedemployer});
                }
              } else {
                $state.go("connection");
              }
            }
            return true;
          }
        });
      }

    }]);
