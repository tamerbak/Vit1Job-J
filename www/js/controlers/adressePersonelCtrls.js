/**
 * Created by Omar on 15/10/2015.
 */

starter

	.controller('adressePersonelCtrl', function ($scope, $rootScope, $state,$stateParams, UpdateInServer,
			DataProvider, Validator, UserService, GeoService, $ionicPopup,localStorageService ,$ionicPopup,$timeout,Global){

				//go back
				$scope.$on('$ionicView.beforeEnter', function (event, viewData) {
          var jobyer=localStorageService.get('jobyer');
          console.log(typeof jobyer);
          if (typeof jobyer.adressePersonel == 'object') 
          {
            
            var result = { 
              address_components: [], 
              adr_address: "", 
              formatted_address: jobyer.adressePersonel.fullAddress,
              geometry: "",
              icon: "",
              lat:null,
              lng:null
            };
            var ngModel = angular.element($('#autocomplete_personel')).controller('ngModel');
            console.log(ngModel);
            ngModel.$setViewValue(result);
            ngModel.$render();
          };
						viewData.enableBack = true;
			  });

		// FORMULAIRE
    var geolocated=false;
    $scope.placesOptions = {
      types: [],
      componentRestrictions: {country:'FR'}
    };
		$scope.formData = {};
    $scope.formData.address="";
    $scope.disableTagButton = (localStorageService.get('steps')!=null)?{'visibility': 'hidden'}:{'visibility': 'visible'};
    var steps =  (localStorageService.get('steps')!=null) ? localStorageService.get('steps') : '';
    $scope.geocodeOptions = {
      componentRestrictions: {
        country : 'FR'
      }
    };
		// RECUPERATION SESSION-ID & JOBEYER-ID
		$scope.updateAdressePersJobyer = function(){
      var steps =  (localStorageService.get('steps')!=null) ? localStorageService.get('steps') : '';
      var codePostal="", ville="",num="",adresse1="",adresse2="";
			// RECUPERATION CONNEXION
			connexion=localStorageService.get('connexion');
			// RECUPERATION JOBEYER ID
			var jobeyeId=connexion.jobeyeId;
			// RECUPERATION SESSION ID
			sessionId=localStorageService.get('sessionID');
			UpdateInServer.updateAdressePersJobeyer(jobeyeId, codePostal, ville, num, adresse1, adresse2, sessionId)
					.success(function (response){

						Jobyer=localStorageService.get('jobyer');
						if(!Jobyer)
							var Jobyer={};
						var adressePersonel={};
            // if ($scope.formData.address.formatted_address) 
            // {
              adressePersonel={fullAddress:$scope.formData.address.formatted_address};
            // }else{
            //   adressePersonel={fullAddress:""};
            // }
						
						Jobyer.adressePersonel=adressePersonel;

						// PUT IN SESSION
						localStorageService.set('jobyer', Jobyer);
					}).error(function (err){
						console.log("error : insertion DATA");
						console.log("error In updateAdressePersJOBEYER: "+error)
					})
		//	}
			// REDIRECTION VERS PAGE - ADRESSE TRAVAI
      if(steps)
      {
        
        if(steps.step3)
        {
          $state.go('adresseTravail');
        }
        else
        {
          $state.go('contract');
        }

      }
      else
      {
        $state.go('adresseTravail',{"geolocated":geolocated,adressePersonel:$scope.formData.address});
      }
			
		};

		// VALIDATION - FIELD
		$scope.validatElement=function(id){
			Validator.checkField(id);
		};


   function displayPopups(){
        // INITIALISATION FORMULAIRE
        var myPopup = $ionicPopup.show({
          //Votre géolocalisation pour renseigner votre adresse du siège social?
          template: "Localisation: êtes-vous dans votre siège social?<br>",
          title: "<div class='vimgBar'><img src='img/vit1job-mini2.png'></div>",
          buttons: [
            {
              text: '<b>Non</b>',
              type: 'button-dark',
              onTap: function(e) {
                myPopup.close();
                geolocated=false;
              }
            },{
              text: '<b>Oui</b>',
              type: 'button-calm',
              onTap: function(e){
                myPopup.close();
                $timeout( function () {
                  var myPopup2 = $ionicPopup.show({
                    //Votre géolocalisation pour renseigner votre adresse du siège social?
                    template: "Si vous acceptez d'être localisé, vous n'aurez qu'à valider l'adresse de votre siège social.<br>",
                    title: "<div class='vimgBar'><img src='img/vit1job-mini2.png'></div>",
                    buttons: [
                      {
                        text: '<b>Non</b>',
                        type: 'button-dark',
                        onTap: function (e) {
                          myPopup2.close();
                          geolocated = false;
                        }
                      }, {
                        text: '<b>Oui</b>',
                        type: 'button-calm',
                        onTap: function (e) {
                          myPopup2.close();
                          GeoService.getUserAddress().then(function() {
                          geolocated = true;
                          var geoAddress = localStorageService.get('user_address');

                          $scope.formData.adresse1 = geoAddress.street;
                          $scope.formData.adresse2 = geoAddress.complement;
                          $scope.formData.num = geoAddress.num;
                          $scope.formData.initialCity = geoAddress.city;
                          $scope.formData.initialPC = geoAddress.postalCode;

                          // $scope.formData.address=geoAddress.fullAddress;
                          var result = { 
                            address_components: [], 
                            adr_address: "", 
                            formatted_address: geoAddress.fullAddress,
                            geometry: "",
                            icon: "",
                            lat:null,
                            lng:null
                          };
                          var ngModel = angular.element($('#autocomplete_personel')).controller('ngModel');
                          ngModel.$setViewValue(result);
                          ngModel.$render();
                        }, function(error) {
                            Global.showAlertValidation("Impossible de vous localiser, veuillez vérifier vos paramétres de localisation");
                        });
                        }
                      }
                    ]
                  });
                });
              }
            }
          ]
        });
    }
		$scope.$on("$ionicView.beforeEnter", function( scopes, states ){
      
			if(states.stateName == "adressePersonel" ){ //states.fromCache &&
				//$scope.initForm();
				//Jobyer=localStorageService.get('Jobyer');
        var steps =  (localStorageService.get('steps')!=null) ? localStorageService.get('steps') : '';
         if(steps!='')
           {
             $scope.title="Présaisie des informations contractuelles : adresse siège social";
             if (steps.state) 
              {
                steps.step2=false;
                localStorageService.set("steps",steps);
              };
             $scope.isContractInfo=true;
            $ionicPopup.show({
              title: "<div class='vimgBar'><img src='img/vit1job-mini2.png'></div>",
              template: 'Veuillez remplir les données suivantes, elle seront utilisées dans le processus du contractualisation.',
              buttons : [
              {
                  text: '<b>OK</b>',
                  type: 'button-dark',
                  onTap: function(e) {
                  //$ionicPopup.hide();
								  $timeout( function () {
                  displayPopups();
								});
                  }
                }
              ]
            });
          }else{
            $scope.title="Siège social";
            $scope.isContractInfo=false;
            displayPopups();
          }

			}
    });
    $scope.displayAdresseTooltip = function () {
      $scope.adresseToolTip = "Astuce : Commencez par le code postal";
      $scope.showAdresseTooltip = true;
    };
    $scope.displayAdresseTooltip();

    $scope.fieldIsEmpty = function() {
      if($scope.formData.address == "" || $scope.formData.address == null){
        return true;
      } else {
        return false;
      }
    };

//mobile tap on autocomplete workaround!
  $scope.disableTap = function(){

    var container = document.getElementsByClassName('pac-container');
    if(screen.height <= 480){
      angular.element(container).attr('style', 'height: 60px;overflow-y: scroll');
    }
    angular.element(container).attr('data-tap-disabled', 'true');

    angular.element(container).on("click", function(){
        document.getElementById('address').blur();
        //google.maps.event.trigger(autoComplete, 'place_changed');
    })
  };
  $scope.skipDisabled= function(){
    var jobyer=localStorageService.get('jobyer');
    var steps = localStorageService.get('steps');
    if (steps) 
      {
        return steps.state || ($scope.isContractInfo && (!jobyer || !jobyer.adressePersonel || !jobyer.adressePersonel.fullAddress));
      }
      else
      {
        return $scope.isContractInfo && (!jobyer || !jobyer.adressePersonel || !jobyer.adressePersonel.fullAddress);
    
      }

    };  
});
