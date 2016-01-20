/**
 * Created by Omar on 15/10/2015.
 */
'use strict';
starter

  .controller('adresseTravailCtrl', function ($scope, $rootScope, localStorageService, $state, $stateParams,formatString,
                                              UpdateInServer, LoadList, DataProvider, Validator, Global, $ionicPopup, $ionicHistory,GeoService,$timeout){
      //go Back
      $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
          viewData.enableBack = true;
      });

    // FORMULAIRE
    $scope.formData = {};
    $scope.placesOptions = {
        types: [],
        componentRestrictions: {country:'FR'}
      };
    $scope.formData.addressTravail="";
    $scope.disableTagButton = (localStorageService.get('steps')!=null)?{'visibility': 'hidden'}:{'visibility': 'visible'};
    var steps =  (localStorageService.get('steps')!=null) ? localStorageService.get('steps') : '';
    // RECUPERATION SESSION-ID & JOBYER-ID
    $scope.updateAdresseTravJobyer = function(){

      var codePost="", ville="" , num = "" , adresse1="" , adresse2="";
      // RECUPERATION CONNEXION
      var connexion=localStorageService.get('connexion');
      // RECUPERATION JOBYER ID
      var jobyerId=connexion.jobyerID;
      // RECUPERATION SESSION ID
      var sessionId=localStorageService.get('sessionID');
      UpdateInServer.updateAdresseTravJobyer(jobyerId, codePost, ville,num, adresse1, adresse2, sessionId)
        .success(function (response){
          // console.log(response);
          jobyer=localStorageService.get('jobyer');
          if(!jobyer)
            var jobyer={};
          var adresseTravail={};
          adresseTravail={fullAddress:$scope.formData.addressTravail.formatted_address};
          jobyer.adresseTravail=adresseTravail;

          // PUT IN SESSION
          localStorageService.set('jobyer', jobyer);
          // console.log("jobyer : "+JSON.stringify(jobyer));
        }).error(function (err){
        console.log("error : insertion DATA");
        console.log("error In updateAdresseTravjobyer: "+err);
      });
      var steps =  (localStorageService.get('steps')!=null) ? localStorageService.get('steps') : '';
      // REDIRECTION VERS PAGE - offres
      if(steps == '') $state.go('offres');
      else $state.go('contract');
    };

    // VALIDATION
    $scope.validatElement=function(id){
      Validator.checkField(id);
    };

    $rootScope.$on('show-pop-up', function(event, args){

      var params = args.params;
      // console.log("params : "+JSON.stringify(params));


    });

    $scope.$on("$ionicView.beforeEnter", function(scopes, states){
      if(states.stateName == "adresseTravail" ){
        //$scope.initForm();
        var steps =  (localStorageService.get('steps')!=null) ? localStorageService.get('steps') : '';
         if(steps!='')
           {
             $scope.title="Présaisie des informations contractuelles : Adresse De départ au travail";
             if (steps.state) 
              {
                steps.step3=false;
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
                      $timeout(function () {
                      displayPopups();
                    });
                    }
                  }
                ]
              });
          }else{
            $scope.title="Adresse De Départ Au Travail";
            $scope.isContractInfo=false;
            displayPopups();
          }
        // AFFICHE POPUP - SI JE VIENS
        if($ionicHistory.backView() === "adressePersonel"){}
        // console.log("Je suis ds $ionicView.beforeEnter(adresseTravail)");

        var jobyer=localStorageService.get('jobyer');
        if(jobyer){
          // INITIALISATION FORMULAIRE
          if(jobyer['adresseTravail']){
            // INITIALISATION FORMULAIRE
            /**if(jobyer['adresseTravail'].codePostal)
             document.getElementById('ex2_value').value=jobyer['adresseTravail']['codePostal'];
             if(jobyer.adresseTravail.ville)
             document.getElementById('ex3_value').value=jobyer['adresseTravail']['ville'];**/
            if(jobyer['adresseTravail']){
              //$scope.formData['adresse1']=jobyer['adresseTravail']['adresse1'];
              //$scope.formData['adresse2']=jobyer['adresseTravail']['adresse2'];
              $scope.formData['addressTravail']=jobyer['adresseTravail']['fullAddress'];

            }
          }
        }
      }
    });

    $scope.displayAdresseTooltip = function () {
      $scope.adresseToolTip = "Astuce : Commencez par le code postal";
      $scope.showAdresseTooltip = true;
      // console.log($scope.formData.addressTravail);
    };
    $scope.displayAdresseTooltip();

    $scope.fieldIsEmpty = function() {
      if($scope.formData.addressTravail == "" || $scope.formData.addressTravail == null){
        return true;
      } else {
        return false;
      }
    };

function displayPopup1(){
  //$timeout(function () {

  if (!$stateParams.geolocated) {
        var popup1 = $ionicPopup.show({
          //Votre géolocalisation pour renseigner votre adresse du siège social?
          template: "Localisation: êtes-vous dans votre lieu de départ au travail?<br>",
          title: "<div class='vimgBar'><img src='img/vit1job-mini2.png'></div>",
          buttons: [
            {
              text: '<b>Non</b>',
              type: 'button-dark',
              onTap: function (e1) {
                e1.preventDefault();
                popup1.close();
                // console.log('popup1 non');
              }
            }, {
              text: '<b>Oui</b>',
              type: 'button-calm',
              onTap: function (e2) {
                e2.preventDefault();
                popup1.close();
                // console.log('popup1 oui');
                $timeout(function () {
                  var popup2 = $ionicPopup.show({
                    //Votre géolocalisation pour renseigner votre adresse du siège social?
                    template: "Si vous acceptez d'être localisé, vous n'aurez qu'à valider votre adresse de départ au travail.<br>",
                    title: "<div class='vimgBar'><img src='img/vit1job-mini2.png'></div>",
                    buttons: [
                      {
                        text: '<b>Non</b>',
                        type: 'button-dark',
                        onTap: function (e3) {
                          e3.preventDefault();
                          popup2.close();
                          // console.log('popup2 non');
                        }
                      }, {
                        text: '<b>Oui</b>',
                        type: 'button-calm',
                        onTap: function (e4) {
                          e4.preventDefault();
                          popup2.close();
                          // console.log('popup2-2 oui');
                          GeoService.getUserAddress()
                          .then(function () {
                          var geoAddress = localStorageService.get('user_address');
                          // console.log(geoAddress);
                          $scope.formData.addressTravail = geoAddress.fullAddress;
                          // console.log($scope.formData.addressTravail);
                           var result = { 
                              address_components: [], 
                              adr_address: "", 
                              formatted_address: geoAddress.fullAddress,
                              geometry: "",
                              icon: "",
                              lat:null,
                              lng:null
                            };
                            var ngModel = angular.element($('.autocomplete-travail')).controller('ngModel');
                            // console.log(ngModel);
                            ngModel.$setViewValue(result);
                            ngModel.$render();

                         }, function (error) {
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
  //});
}
function displayPopups(){
  if($stateParams.adressePersonel){
    var popup = $ionicPopup.show({

    template: "L'adresse de départ au travail est-elle différente de l'adresse du siège social? <br>",
    title: "<div class='vimgBar'><img src='img/vit1job-mini2.png'></div>",
    buttons: [
    {
      text: '<b>Oui</b>',
      type: 'button-calm',
      onTap: function (e) {
        e.preventDefault();
        popup.close();
        // console.log('popup oui');
        $timeout(function () {     
          displayPopup1();
        });
      }
    }, {
      text: '<b>Non</b>',
      type: 'button-dark',
      onTap: function (e) {
        e.preventDefault();
        popup.close();
        $scope.formData.addressTravail = $stateParams.adressePersonel;
        $scope.updateAdresseTravJobyer();
        // REDIRECTION VERS PAGE - COMPETENCES
        //$state.go('competence');
      }
    }
  ]
  });
  }else{
    displayPopup1();
  }
}
//mobile tap on autocomplete workaround!
  $scope.disableTap = function(){

    var container = document.getElementsByClassName('pac-container');
    if(screen.height <= 480){
      // console.log("height called");
      angular.element(container).attr('style', 'height: 60px;overflow-y: scroll');
    }
    angular.element(container).attr('data-tap-disabled', 'true');

    angular.element(container).on("click", function(){
        document.getElementById('addresseTravail').blur();
        //google.maps.event.trigger(autoComplete, 'place_changed');
    })
  };
    
  $scope.skipDisabled= function(){
    var jobyer=localStorageService.get('jobyer');
    return $scope.isContractInfo && (!jobyer || !jobyer.adresseTravail || !jobyer.adresseTravail.fullAddress);
  };
  $scope.skipGoto=function(){
    if($scope.isContractInfo)
      $state.go('contract');  
    else  
      $state.go('offres');        
  }

});
