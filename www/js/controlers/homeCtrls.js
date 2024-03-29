/**
 * Created by Tamer on 09/10/2015.
 */
'use strict';

starter

  .controller('homeCtrl', function ($scope, $rootScope, $http, $state, x2js, $ionicPopup, localStorageService, $timeout, $cookies, jobyerService, $ionicHistory) {
    $scope.$on('$ionicView.beforeEnter', function (e, config) {
      config.enableBack = false;
    });
    /*$scope.displayBack = function() {
     return $ionicHistory.viewHistory().backView != null;
     };

     $scope.myGoBack = function() {
     window.history.back();
     };*/

    // FORMULAIRE
    $scope.formData = {};
    //$scope.formData.connexion= {};


    $scope.exitVit = function () {
      navigator.app.exitApp();
    };

    $scope.initConnexion = function () {

      $scope.formData.connexion = {'etat': false, 'libelle': 'Se connecter', 'employeID': 0};
      var cnx = localStorageService.get('connexion');
      if (cnx) {
        $scope.formData.connexion = cnx;
        console.log("Employeur est connecté");
      }

      console.log("connexion[employeID] : " + $scope.formData.connexion.employeID);
      console.log("connexion[libelle] : " + $scope.formData.connexion.libelle);
      console.log("connexion[etat] : " + $scope.formData.connexion.etat);
      $scope.formData.mDate = new Date();
    };

    $scope.$on("$ionicView.beforeEnter", function (scopes, states) {
      if (states.fromCache && states.stateName == "menu.app") {
        $scope.initConnexion();
      }
    });

    $scope.modeConnexion = function () {
      var estConnecte = 0;
      var cnx = localStorageService.get('connexion');
      if (cnx) {
        if (cnx.etat) {
          console.log("IL S'AGIT D'UNE DECONNEXION");

          localStorageService.remove('connexion');
          localStorageService.remove('sessionID');
          var connexion = {'etat': false, 'libelle': 'Se connecter', 'employeID': 0};
          localStorageService.set('connexion', connexion);

          console.log("New Connexion : " + JSON.stringify(localStorageService.get('connexion')));
          $state.go("menu.connection");


        }
        else {
          console.log("IL S'AGIT D'UNE CONNEXION");
          $state.go("menu.connection");
        }
      }
      else
        $state.go("menu.connection");
    };

    var checkIsLogged = function () {
      var currentEmployer = localStorageService.get('currentEmployer');
      var isELogged = (currentEmployer) ? true : false;
      return isELogged;
    };

    $scope.$on('$ionicView.beforeEnter', function () {
      $scope.isLogged = checkIsLogged();
    });

    $scope.logOut = function () {
      localStorageService.remove('currentEmployer');
      $scope.isLogged = false;

      localStorageService.remove('connexion');
      var connexion = {
        'etat': false,
        'libelle': 'Se connecter',
        'employeID': ""
      };

      localStorageService.set('connexion', connexion);

      location.reload(false);

    };

    var showNonConnectedPopup = function () {
      var confirmPopup = $ionicPopup.confirm({
        title: "<div class='vimgBar'><img src='img/vit1job-mini2.png'></div>",
        template: 'Pour que la recherche soit plus précise, vous devez être connectés ?',
        buttons: [
          {
            text: '<b>Connection</b>',
            type: 'button-dark',
            onTap: function (e) {
              confirmPopup.close();
              $state.go("menu.connection");
            }
          }, {
            text: '<b>Retour</b>',
            type: 'button-calm',
            onTap: function (e) {
              confirmPopup.close();
            }
          }

        ]
      });
    };

    var showAddOfferConfirmPopup = function (job) {
      var confirmPopup = $ionicPopup.confirm({
        title: "<div class='vimgBar'><img src='img/vit1job-mini2.png'></div>",
        template: 'Afin d’être Vite On Job précisez vos critères de  recherche de ' + job + '?',
        buttons: [
          {
            text: '<b>Non</b>',
            type: 'button-dark',
            onTap: function (e) {
              confirmPopup.close();
              //getJobyersOffersByJob(job);
              var offerId = "";
              jobyerService.recherche(job, offerId).success(onGetJobyersOffersByJobSuccess).error(onError); //HERE
            }
          }, {
            text: '<b>Ok</b>',
            type: 'button-calm',
            onTap: function (e) {
              confirmPopup.close();
              $state.go("menu.offres");
            }
          }

        ]
      });
    };

    var onGetJobyersOffersByJobSuccess = function (data) {
      if (!(data == null) && !(data.length == 0)){
        var sdata = data[0]['value'];
        var jobyersOffers = JSON.parse(sdata);
        localStorageService.set('jobyersOffers', jobyersOffers);
      }
      $state.go("menu.jobyersOffersTab.list");
    };

    var onError = function (data) {
      console.log(data);
    };

    var getJobyersOffersByJob = function (job) {
      jobyerService.getJobyersOffersByJob(job).success(onGetJobyersOffersByJobSuccess).error(onError);
    };

    var isEntrepriseOfferByJobExists = function (job) {
      if (!job) return;
      var currentEmployer = localStorageService.get('currentEmployer');
      if (!currentEmployer) return;
      //var entreprises = currentEmployer.entreprises;
      var found = false;
      //if (entreprises && entreprises.length > 0) {
      var i = 0;
      var offers = [];
      var pricticesJob = [];
      var j;
      var k;
      //while (!found && i < entreprises.length) {
      offers = currentEmployer.competences;
      if (offers && offers.length > 0) {
        j = 0;
        while (!found && j < offers.length) {
          pricticesJob = offers[j].pricticesJob;
          if (pricticesJob && pricticesJob.length > 0) {
            k = 0;
            while (!found && k < pricticesJob.length) {
              //TEL does search sentence contains job label ? ICIM
              found = (pricticesJob[k].job && job.toLowerCase().indexOf(pricticesJob[k].job.toLowerCase()) > -1);
              //found = (pricticesJob[k].job && pricticesJob[k].job.toLowerCase() == job.toLowerCase());
              if (found) {
                var currentOffer = {
                  'id': offers[j].offerId.toString(),
                  'label': offers[j].title
                };
                localStorageService.set('currentOffer', currentOffer);
                /*var currentEntreprise = {
                  'id': entreprises[i].entrepriseId.toString(),
                  'label': entreprises[i].name
                };
                localStorageService.set('currentEntreprise', currentEntreprise);
                loadCurrentEmployerEntreprises();*/
              }
              else {
                k++;
              }
            }
          }
          if (!found) j++;
        }
      }
      if (!found) i++;
      //}
      //}

      /*if(!found && $rootScope.offres != undefined) {
       var offers = $rootScope.offres;
       for(var i=0 ; i < $rootScope.offres.length ;i++){
       var practiceJob = offers[i].pricticesJob[k].job;
       found = (practiceJob && job.toLowerCase().indexOf(job.toLowerCase())>-1);
       if(found){
       var currentOffer = {
       'id' : offers[i].offerId.toString(),
       'label' : offers[i].title
       };
       localStorageService.set('currentOffer',currentOffer);
       var currentEntreprise = {
       'id' : entreprises[0].entrepriseId.toString(),
       'label' : entreprises[0].name
       };
       localStorageService.set('currentEntreprise',currentEntreprise);
       loadCurrentEmployerEntreprises();
       }
       }
       }

       var offers = localStorageService.get('offres');
       if(!found && offers != undefined && offers.length>0 && offers[0].length>0) {
       for(var i=0 ; i < offers.length ;i++){
       var practiceJob = offers[i].job.title;
       found = (practiceJob && job.toLowerCase().indexOf(job.toLowerCase())>-1);
       if(found){
       var currentOffer = {
       'id' : offers[i].offerId.toString(),
       'label' : offers[i].title
       };
       localStorageService.set('currentOffer',currentOffer);
       var currentEntreprise = {
       'id' : entreprises[0].entrepriseId.toString(),
       'label' : entreprises[0].name
       };
       localStorageService.set('currentEntreprise',currentEntreprise);
       loadCurrentEmployerEntreprises();
       }
       }
       }*/

      return found;
    };

    var loadCurrentEmployerEntreprises = function () {
      var currentEmployer = localStorageService.get('currentEmployer');
      if (!currentEmployer) return;
      var currentEmployerEntreprises = currentEmployer.entreprises;
      if (currentEmployerEntreprises && currentEmployerEntreprises.length > 0) {
        var entreprises = [];
        var entreprise;
        var offers = [];
        var offer;
        for (var i = 0; i < currentEmployerEntreprises.length; i++) {
          offers = [];
          if (currentEmployerEntreprises[i] && currentEmployerEntreprises[i].offers && currentEmployerEntreprises[i].offers.length > 0) {
            for (var j = 0; j < currentEmployerEntreprises[i].offers.length; j++) {
              offer = {
                'id': (currentEmployerEntreprises[i].offers[j].offerId) ? currentEmployerEntreprises[i].offers[j].offerId.toString() : currentEmployerEntreprises[i].offers[j].pk.toString(),
                'label': currentEmployerEntreprises[i].offers[j].title
              };
              offers.push(offer);
            }
          }
          entreprise = {
            'id': currentEmployerEntreprises[i].entrepriseId.toString(),
            'label': currentEmployerEntreprises[i].name,
            'offers': offers
          };
          entreprises.push(entreprise);
        }
        localStorageService.set('currentEmployerEntreprises', entreprises);
      }
    };

    $scope.launchSearchForJobyersOffers = function (job) {
      localStorageService.set('lastSearchedJob', job);

      var offerId = 0;

      localStorageService.remove('currentEntreprise');
      localStorageService.remove('currentOffer');
      localStorageService.remove('currentEmployerEntreprises');

      var isLogged = checkIsLogged();
      if (isLogged) {
        if (isEntrepriseOfferByJobExists(job)) {
          offerId = localStorageService.get('currentOffer').id;
          jobyerService.recherche(job, offerId).success(onGetJobyersOffersByJobSuccess).error(onError);
        } else {
          showAddOfferConfirmPopup(job);
        }
      }
      else {
        jobyerService.recherche(job, "").success(onGetJobyersOffersByJobSuccess).error(onError);
      }
    };

    $scope.personCriteria = function () {

      if ($scope.pStyle) {
        if ($scope.pStyle.activated) {
          $scope.bPerson = false;
          $scope.formData.mPerson = "";
          $scope.pStyle = {
            "activated": false,
            "background-color": "white"
          }
        } else {
          $scope.bPerson = true;
          $scope.pStyle = {
            "activated": true,
            "background-color": "#14BAA6"
          }
        }
      } else {
        //$scope.mPerson = "";
        $scope.bPerson = true;
        $scope.pStyle = {
          "activated": true,
          "background-color": "#14BAA6"
        }
      }
    };

    $scope.sectorCriteria = function () {

      if ($scope.sStyle) {
        if ($scope.sStyle.activated) {
          $scope.bSector = false;
          $scope.formData.mSector = "";
          $scope.sStyle = {
            "activated": false,
            "background-color": "white"
          }
        } else {
          $scope.bSector = true;
          $scope.sStyle = {
            "activated": true,
            "background-color": "#14BAA6"
          }
        }
      } else {
        $scope.bSector = true;
        $scope.sStyle = {
          "activated": true,
          "background-color": "#14BAA6"
        }
      }
    };

    $scope.jobCriteria = function () {

      if ($scope.jStyle) {
        if ($scope.jStyle.activated) {
          $scope.bJob = false;
          $scope.formData.mJob = "";
          $scope.jStyle = {
            "activated": false,
            "background-color": "white"
          }
        } else {
          $scope.bJob = true;
          $scope.jStyle = {
            "activated": true,
            "background-color": "#14BAA6"
          }
        }
      } else {
        $scope.bJob = true;
        $scope.jStyle = {
          "activated": true,
          "background-color": "#14BAA6"
        }
      }
    };

    $scope.entreCriteria = function () {

      if ($scope.enStyle) {
        if ($scope.enStyle.activated) {
          $scope.bEntreprise = false;
          $scope.formData.mEntreprise = "";
          $scope.enStyle = {
            "activated": false,
            "background-color": "white"
          }
        } else {
          $scope.bEntreprise = true;
          $scope.enStyle = {
            "activated": true,
            "background-color": "#14BAA6"
          }
        }
      } else {
        $scope.bEntreprise = true;
        $scope.enStyle = {
          "activated": true,
          "background-color": "#14BAA6"
        }
      }
    };

    $scope.calCriteria = function () {

      if ($scope.cStyle) {
        if ($scope.cStyle.activated) {
          $scope.bcal = false;
          $scope.formData.mDate = "";
          $scope.cStyle = {
            "activated": false,
            "background-color": "white"
          }
        } else {
          $scope.bcal = true;
          $scope.cStyle = {
            "activated": true,
            "background-color": "#14BAA6"
          }
        }
      } else {
        $scope.bcal = true;
        $scope.cStyle = {
          "activated": true,
          "background-color": "#14BAA6"
        }
      }
    };

    $scope.locationCriteria = function () {

      if ($scope.loStyle) {
        if ($scope.loStyle.activated) {
          $scope.blocation = false;
          $scope.formData.mLocation = "";
          $scope.loStyle = {
            "activated": false,
            "background-color": "white"
          }
        } else {
          $scope.blocation = true;
          $scope.loStyle = {
            "activated": true,
            "background-color": "#14BAA6"
          }
        }
      } else {
        $scope.blocation = true;
        $scope.loStyle = {
          "activated": true,
          "background-color": "#14BAA6"
        }
      }
    };

    $scope.criteriaSearch = function () {

      var person = "",
        sector = "",
        job = "",
        enterprise = "",
        date = "",
        location = "";

      if ($scope.formData.mPerson) person = $scope.formData.mPerson;
      if ($scope.formData.mSector) sector = $scope.formData.mSector;
      if ($scope.formData.mJob) job = $scope.formData.mJob;
      if ($scope.formData.mEntreprise) enterprise = $scope.formData.mEntreprise;
      if ($scope.formData.mDate) date = $scope.formData.mDate.getDate().toString() +"/" +
        ($scope.formData.mDate.getMonth() + 1) + "/" +
        $scope.formData.mDate.getFullYear().toString();
      if ($scope.formData.mLocation) location = $scope.formData.mLocation;

      var data = {
        "job": job,
        "metier": sector,
        "entreprise" : enterprise,
        "lieu": location,
        "nom": person,
        "date": date //"DD/MM/YYYY"
      };

      // Call web service :
      jobyerService.criteriaSearchService(data).
        success(function (response) {
          console.log('recherche par critères bien executée');
          onGetJobyersOffersByJobSuccess(response);
        }).
        error(function (error) {
          onError();
          console.log('erreur dans le ws de la recherche par critères : ' + error)
        });


    };

  });
