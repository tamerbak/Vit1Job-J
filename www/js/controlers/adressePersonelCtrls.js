/**
 * Created by Omar on 15/10/2015.
 */

starter

  .controller('adressePersonelCtrl', function ($scope, $rootScope, $state, $stateParams, UpdateInServer,
                                               DataProvider, Validator, UserService, GeoService, $ionicPopup, localStorageService, $ionicPopup, $timeout, Global) {

    // FORMULAIRE
    var geolocated = false;
    $scope.formData = {};
    $scope.placesOptions = {
      types: [],
      componentRestrictions: {country: 'FR'}
    };
    // $scope.formData.address="";
    $scope.disableTagButton = (localStorageService.get('steps') != null) ? {'visibility': 'hidden'} : {'visibility': 'visible'};
    var steps = (localStorageService.get('steps') != null) ? localStorageService.get('steps') : '';
    $scope.geocodeOptions = {
      componentRestrictions: {
        country: 'FR'
      }
    };
    // RECUPERATION SESSION-ID & EMPLOYEUR-ID
    $scope.updateAdressePersEmployeur = function () {

      if (!$scope.formData.address)
        return;
      var adresse = $scope.formData.address.adr_address;
      localStorageService.set('adr_address', $scope.formData.address);
      var steps = (localStorageService.get('steps') != null) ? localStorageService.get('steps') : '';
      var codePostal = "", ville = "", num = "", adresse1 = "", adresse2 = "";


      var currentEmployer = localStorageService.get('currentEmployer');
      var employeId = currentEmployer.jobyerId;
      //var entreprises = currentEmployer.entreprises;  //  I am sure that there is a company associated with the user
      //var eid = currentEmployer.entreprises[0].entrepriseId;


      UpdateInServer.updateAdressePersEmployeur(employeId, adresse)
        .success(function (response) {

          //TEL 25022016 : to remove !
          /*employeur = localStorageService.get('employeur');
           if (!employeur)
           var employeur = {"civilite": "", "nom": "", "prenom": "", entreprise: "", siret: "", ape: "", numUssaf: ""};
           var adressePersonel = {};
           if ($scope.formData.address.formatted_address)
           adressePersonel = {'fullAddress': $scope.formData.address.formatted_address};
           else
           adressePersonel = {'fullAddress': ""};
           employeur.adressePersonel = adressePersonel;
           employeur.formdataAddress = $scope.formData.address;

           // PUT IN SESSION
           localStorageService.set('employeur', employeur);*/

          //TEL 25022016 : to establish :
          /*var addresses = entreprises.adresses;
           if (!addresses)
           addresses = [];

           addresses.push(
           {
           "addressId" : JSON.parse(response[0].value).id,
           "siegeSocial" : "false",
           "adresseTravail" : "true",
           "fullAdress" : $scope.formData.address.formatted_address
           }
           );*/

          currentEmployer.adressePersonelle = {
            "addressId": JSON.parse(response[0].value).id,
            "fullAddress": $scope.formData.address.formatted_address
          };


          //entreprises.adresses = addresses;
          //currentEmployer.entreprises = entreprises;
          localStorageService.set('currentEmployer', currentEmployer);

        }).error(function (err) {
          console.log("error : insertion DATA");
          console.log("error In updateAdressePersEmployeur: " + err);
        });
      // }
      // REDIRECTION VERS PAGE - ADRESSE TRAVAIL
      if (steps) {

        if (steps.step3) {
          $state.go('menu.infoTabs.adresseTravail');
        }
        else {
          $state.go('menu.contract');
        }

      }
      else {

        $state.go('menu.infoTabs.adresseTravail', {"geolocated": geolocated, "addressPers": $scope.formData.address});
      }

    };

    // VALIDATION - FIELD
    $scope.validatElement = function (id) {
      Validator.checkField(id);
    };

    $scope.$watch('formData.zipCodes', function () {
      // console.log('hey, formData.zipCodes has changed!');
      //console.log('zipCodes.length : '+$scope.formData.zipCodes.length);
    });

    function displayPopups() {
      if (isNaN($scope.formData.codePostal) && isNaN($scope.formData.ville) && !$scope.formData.adresse1 && !$scope.formData.adresse2 && !$scope.formData.num) {
        // INITIALISATION FORMULAIRE
        var myPopup = $ionicPopup.show({
          //Votre géolocalisation pour renseigner votre adresse du siège social?
          template: "Localisation: êtes-vous dans votre domicile?<br>",
          title: "<div class='vimgBar'><img src='img/vit1job-mini2.png'></div>",
          buttons: [
            {
              text: '<b>Non</b>',
              type: 'button-dark',
              onTap: function (e) {
                myPopup.close();
              }
            }, {
              text: '<b>Oui</b>',
              type: 'button-calm',
              onTap: function (e) {
                myPopup.close();
                $timeout(function () {
                  var myPopup2 = $ionicPopup.show({
                    //Votre géolocalisation pour renseigner votre adresse du siège social?
                    template: "Si vous acceptez d'être localisé, vous n'aurez qu'à valider votre adresse personnelle.<br>",
                    title: "<div class='vimgBar'><img src='img/vit1job-mini2.png'></div>",
                    buttons: [
                      {
                        text: '<b>Non</b>',
                        type: 'button-dark',
                        onTap: function (e) {
                          myPopup2.close();
                        }
                      }, {
                        text: '<b>Oui</b>',
                        type: 'button-calm',
                        onTap: function (e) {
                          myPopup2.close();
                          GeoService.getUserAddress().then(function () {
                            geolocated = true;
                            var geoAddress = localStorageService.get('user_address');
                            // $scope.formData.address=geoAddress.fullAddress;

                            var result = {
                              address_components: [],
                              adr_address: geoAddress.adr_address,
                              formatted_address: geoAddress.fullAddress,
                              geometry: "",
                              icon: ""
                            };
                            var ngModel = angular.element($('#autocomplete_personel')).controller('ngModel');
                            ngModel.$setViewValue(result);
                            ngModel.$render();
                          }, function (error) {
                            Global.showAlertValidation("Impossible de vous localiser, veuillez vérifier vos paramètres de localisation");
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
    }

    //$scope.$on("$ionicView.beforeEnter", function () {
    //$scope.formData.zipCodes = DataProvider.getZipCodes();
    //$scope.formData.villes = DataProvider.getVilles();
    //});

    $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
      viewData.enableBack = true;
    });
    $scope.$on("$ionicView.beforeEnter", function (scopes, states) {
        var employeur = localStorageService.get('currentEmployer');
        var adrExist = false;
        if (employeur) {
          var result = {
            address_components: [],
            adr_address: "",
            formatted_address: (employeur.adressePersonelle) ? employeur.adressePersonelle.fullAddress : "",
            geometry: "",
            icon: ""
          };
          var ngModel = angular.element($('#autocomplete_personel')).controller('ngModel');
          ngModel.$setViewValue(result);
          ngModel.$render();
          if ((employeur.adressePersonelle.fullAddress))
            adrExist = true;
        }


        if (states.stateName == "menu.infoTabs.adressePersonel") { //states.fromCache &&
          //$scope.initForm();
          //employeur=localStorageService.get('employeur');
          var steps = (localStorageService.get('steps') != null) ? localStorageService.get('steps') : '';
          if (steps) {
            $scope.title = "Pré-saisie des informations contractuelles : adresse personnelle";
            $scope.isContractInfo = true;

            if (steps.state) {
              steps.step2 = false;
              localStorageService.set("steps", steps);
            }

            $ionicPopup.show({
              title: "<div class='vimgBar'><img src='img/vit1job-mini2.png'></div>",
              template: 'Veuillez remplir les données suivantes, elle seront utilisées dans le processus de la contractualisation.',
              buttons: [
                {
                  text: '<b>OK</b>',
                  type: 'button-dark',
                  onTap: function (e) {
                    //$ionicPopup.hide();
                    $timeout(function () {
                      displayPopups();
                    });
                  }
                }
              ]
            });
          }
          else {
            $scope.title = "Adresse personnelle";
            $scope.isContractInfo = false;
            if (adrExist == false)
              displayPopups();
          }
        }


      }
    );

    $scope.displayAdresseTooltip = function () {
      $scope.adresseToolTip = "Astuce : Commencez par le code postal";
      $scope.showAdresseTooltip = true;
    };
    $scope.displayAdresseTooltip();

    $scope.fieldIsEmpty = function () {
      if ($scope.formData.address == "" || $scope.formData.address == null) {
        return true;
      } else {
        return false;
      }
    };

//mobile tap on autocomplete workaround!
    $scope.disableTap = function () {

      var container = document.getElementsByClassName('pac-container');
      if (screen.height <= 480) {
        angular.element(container).attr('style', 'height: 60px;overflow-y: scroll');
      }
      angular.element(container).attr('data-tap-disabled', 'true');

      angular.element(container).on("click", function () {
        document.getElementById('address').blur();
        //google.maps.event.trigger(autoComplete, 'place_changed');
      })
    };

    /*$scope.skipDisabled = function () {
     var employeur = localStorageService.get('employeur');
     return $scope.isContractInfo && (!employeur || !employeur.adressePersonel || !employeur.adressePersonel.fullAddress);
     };*/
  });
