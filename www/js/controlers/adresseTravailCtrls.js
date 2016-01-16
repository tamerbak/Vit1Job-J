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
    $scope.formData.addressTravail="";
    $scope.disableTagButton = (localStorageService.get('steps')!=null)?{'visibility': 'hidden'}:{'visibility': 'visible'};
    var steps =  (localStorageService.get('steps')!=null) ? JSON.parse(localStorageService.get('steps')) : '';
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
          console.log(response);
          jobyer=localStorageService.get('jobyer');
          if(!jobyer)
            var jobyer={};
          var adresseTravail={};
          adresseTravail={fullAddress:$scope.formData.addressTravail};
          jobyer.adresseTravail=adresseTravail;

          // PUT IN SESSION
          localStorageService.set('jobyer', jobyer);
          console.log("jobyer : "+JSON.stringify(jobyer));
        }).error(function (err){
        console.log("error : insertion DATA");
        console.log("error In updateAdresseTravjobyer: "+err);
      });
      var steps =  (localStorageService.get('steps')!=null) ? JSON.parse(localStorageService.get('steps')) : '';
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
      console.log("params : "+JSON.stringify(params));


    });

    $scope.$on("$ionicView.beforeEnter", function(scopes, states){
      console.log(states.fromCache+"  state : "+states.stateName);
      if(states.stateName == "adresseTravail" ){
        //$scope.initForm();
        var steps =  (localStorageService.get('steps')!=null) ? JSON.parse(localStorageService.get('steps')) : '';
         if(steps!='')
           {
             $scope.title="Présaisie des informations contractuelles : Adresse De départ au travail";
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
        console.log("Je suis ds $ionicView.beforeEnter(adresseTravail)");

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

    $scope.updateAutoCompleteZip= function(){
      console.log("zip : "+$scope.formData.zipCodeSelected.pk);
      var zipCodes=$scope.formData.zipCodes;
      // RECHERCHE LIBELLE
      for(var i=0; i<zipCodes.length; i++){
        if(zipCodes[i]['pk_user_code_postal'] === $scope.formData.zipCodeSelected.pk){
          $scope.formData.zipCodeSelected.libelle=zipCodes[i]['libelle'];
          break;
        }
      }

      if(typeof $scope.formData.codePostal === 'undefined')
        $scope.formData.codePostal={};
      $scope.formData.codePostal.originalObject={'pk_user_code_postal': $scope.formData.zipCodeSelected.pk, 'libelle': $scope.formData.zipCodeSelected.libelle};
      console.log("formData.codePostal : "+JSON.stringify($scope.formData.codePostal));
      document.getElementById('ex2_value').value=$scope.formData.zipCodeSelected['libelle'];
      /*
       // VIDER LIST - VILLES
       $scope.formData.villes=[];
       var villes=DataProvider.getVilles();
       for(var i=0; i<villes.length; i++){
       if(villes[i]['fk_user_code_postal'] === $scope.formData.zipCodeSelected.pk)
       $scope.formData.villes.push(villes[i]);
       }

       // RE-INITIALISE INPUT VILLE
       document.getElementById('ex3_value').value='Villes';
       $scope.formData.ville={};

       */
    };

    $scope.displayAdresseTooltip = function () {
      $scope.adresseToolTip = "Astuce : Commencez par le code postal";
      $scope.showAdresseTooltip = true;
      console.log($scope.formData.addressTravail);
    };

    $scope.fieldIsEmpty = function() {
      if($scope.formData.addressTravail == "" || $scope.formData.addressTravail == null){
        return true;
      } else {
        return false;
      }
    };

    $scope.updateAutoCompleteVille= function(){
      console.log("ville : "+$scope.formData.villeSelected.pk);
      var villes=$scope.formData.villes;
      // RECHERCHE LIBELLE
      for(var i=0; i<villes.length; i++){
        if(villes[i]['pk_user_ville'] === $scope.formData.villeSelected.pk){
          $scope.formData.villeSelected.libelle=villes[i]['libelle'];
          break;
        }
      }

      if(typeof $scope.formData.ville === 'undefined')
        $scope.formData.ville={};
      $scope.formData.ville.originalObject={'pk_user_ville': $scope.formData.villeSelected.pk, 'libelle': $scope.formData.villeSelected.libelle};
      console.log("formData.ville : "+JSON.stringify($scope.formData.ville));
      document.getElementById('ex3_value').value=$scope.formData.villeSelected['libelle'];
      $rootScope.$broadcast('update-list-code', {params: {'fk':$scope.formData.villeSelected.pk, 'list':'ville'}});

    }
function displayPopup1(){
  $timeout(function () {

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
                console.log('popup1 non');
              }
            }, {
              text: '<b>Oui</b>',
              type: 'button-calm',
              onTap: function (e2) {
                e2.preventDefault();
                popup1.close();
                console.log('popup1 oui');
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
                          console.log('popup2 non');
                        }
                      }, {
                        text: '<b>Oui</b>',
                        type: 'button-calm',
                        onTap: function (e4) {
                          e4.preventDefault();
                          popup2.close();
                          console.log('popup2 oui');
              GeoService.getUserAddress()
                .then(function () {
                          var geoAddress = localStorageService.get('user_address');
                          console.log(geoAddress);
                          $scope.formData.adresse1 = geoAddress.street;
                          $scope.formData.adresse2 = geoAddress.complement;
                          $scope.formData.num = geoAddress.num;
                          $scope.formData.initialCity = geoAddress.city;
                          $scope.formData.initialPC = geoAddress.postalCode;
                          $scope.formData.addressTravail = geoAddress.fullAddress;
                          console.log($scope.formData.addressTravail);
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
  });
}
function displayPopups(){
  if($stateParams.addressPers){
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
        console.log('popup oui');
        displayPopup1();
      }
    }, {
      text: '<b>Non</b>',
      type: 'button-dark',
      onTap: function (e) {
        e.preventDefault();
        popup.close();
        console.log('popup non');
        /*$scope.formData.adresse1 = params.adresse1;
        $scope.formData.adresse2 = params.adresse2;
        $scope.formData.num = params.num;
        if (params.code)
          document.getElementById('ex2_value').value = params.code;
        if (params.vi)
          document.getElementById('ex3_value').value = params.vi;
        $scope.formData.initialCity = geoAddress.city;
        $scope.formData.initialPC = geoAddress.postalCode;
        */
        $scope.formData.addressTravail = $stateParams.addressPers;
        $scope.updateAdresseTravEmployeur();
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
      console.log("height called");
      angular.element(container).attr('style', 'height: 60px;overflow-y: scroll');
    }
    angular.element(container).attr('data-tap-disabled', 'true');

    angular.element(container).on("click", function(){
        document.getElementById('addresseTravail').blur();
        //google.maps.event.trigger(autoComplete, 'place_changed');
    })
  };
  });
