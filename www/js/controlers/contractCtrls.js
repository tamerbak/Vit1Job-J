/**
 * Created by mourad sadiq on 12/6/2015.
 */
'use strict';

starter.controller('contractCtrl',function($scope,localStorageService,$stateParams,DataProvider,$ionicPopup,$state, $cordovaPrinter){

  //go Back
  $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
      viewData.enableBack = true;
  });  
  var employer = localStorageService.get('SelectedEmployer');
  //var employer= $stateParams.selectedEmployer;
  console.log(employer);
  var jobyer = localStorageService.get('jobyer');
  $scope.jobyer=jobyer;
  console.log(jobyer);
  var civilites = DataProvider.getCivilites();
  var civilite = "";
  for (var i in civilites)
  {
    if(civilites[i].pk_user_civilite == employer.civilite)
      civilite = civilites[i].libelle;
  }
  $scope.societe = employer.entreprise;
  $scope.contact = civilite + " " + employer.employerName + " " + employer.employerLastName;
  var adrTrv = employer.adresseTravail;
  $scope.lieu = adrTrv.fullAddress;
  //var jobyer = $stateParams.jobyer;
  $scope.firstNameJ = jobyer.nom;
  $scope.lastNameJ = jobyer.prenom;

  // An alert dialog
  $scope.showAlert = function() {
     /*
     var success = function(status) {
            alert('Message: ' + status);
        }

        var error = function(status) {
            alert('Error: ' + status);
        }
      if(ionic.Platform.isIOS()){
        var contract = document.getElementById('printableContent');        
        console.log(document.getElementById("htmlView").innerHTML);
        window.html2pdf.create(
            contract,
            "~/Documents/contrat.pdf", // on iOS,
            // "test.pdf", on Android (will be stored in /mnt/sdcard/at.modalog.cordova.plugin.html2pdf/test.pdf)
            success,
            error
        );
      }
    //printing the pdf
    else{
      */
      if(ionic.Platform.isAndroid() && ionic.Platform.version()<=4.2) {
        var alertPopup1 = $ionicPopup.alert({
        title: 'Info',
        template: "Pour imprimer votre contrat, ou le sauvegarder comme PDF, veuillez configurer les paramètres d'impression de votre telephone"
      });
      alertPopup1.then(function() {
        var alertPopup = $ionicPopup.alert({
        title: 'Succès',
        template: 'Vous avez bien établi un contrat avec '+employer.employerName + " " + employer.employerLastName
      });
      alertPopup.then(function() {
        $state.go("app");
      });
      });
      } else {
        
        console.log(ionic.Platform.version());
      if($cordovaPrinter.isAvailable()) {
        var contract = document.getElementById('printableContent');
        $cordovaPrinter.print(contract);
        var alertPopup = $ionicPopup.alert({
        title: 'Succès',
        template: 'Vous avez bien établi un contrat avec '+employer.employerName + " " + employer.employerLastName
      });
      alertPopup.then(function() {
        $state.go("app");
      });
      } else {
        /*var alertPopup = $ionicPopup.alert({
        title: 'Succès',
        template: 'Vous avez bien établi un contrat avec '+jobyer.jobyerName
      });*/
      var alertPopup1 = $ionicPopup.alert({
        title: 'Info',
        template: "Pour imprimer votre contrat, ou le sauvegarder comme PDF, veuillez configurer les paramètres d'impression de votre telephone"
      });
      alertPopup1.then(function() {
        var alertPopup = $ionicPopup.alert({
        title: 'Succès',
        template: 'Vous avez bien établi un contrat avec '+employer.employerName + " " + employer.employerLastName
      });
      alertPopup.then(function() {
        $state.go("app");
      });
      }); 
      }
    }   
  //}
  };

});
