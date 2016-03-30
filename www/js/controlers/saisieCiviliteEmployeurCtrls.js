/**
 * Created by Omar on 14/10/2015.
 */
'use strict';
starter
  .controller('saisieCiviliteEmployeurCtrl', function ($scope, $rootScope, localStorageService, $state, $stateParams, UpdateInServer, UploadFile, $base64,
                                                       LoadList, formatString, DataProvider, Validator, $ionicPopup, $cordovaCamera) {

    //change input according to platform


    $scope.isIOS = ionic.Platform.isIOS();
    $scope.isAndroid = ionic.Platform.isAndroid();
    var steps = localStorageService.get('steps');

    $scope.showFileDialog = function () {
      document.getElementById('image').click();

    };

    // FORMULAIRE
    $scope.formData = {};
    $scope.siretValide = true;
    $scope.apeValide = true;
    // IMAGE
    $scope.formData.image = {};

    $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
      viewData.enableBack = true;
    });
    $scope.$on("$ionicView.beforeEnter", function (scopes, states) {
      // console.log(states.fromCache+"  state : "+states.stateName);
      if (states.stateName == "menu.infoTabs.saisieCiviliteEmployeur") {
        $scope.disableTagButton = (localStorageService.get('steps') != null) ? {'visibility': 'hidden'} : {'visibility': 'visible'};
        steps = (localStorageService.get('steps') != null) ? localStorageService.get('steps') : '';

        if (steps != '') {
          $scope.title = "Pré-saisie des informations contractuelles : civilité";


          if (steps.state) {
            steps.step1 = false;
            localStorageService.set("steps", steps);
          }

          $scope.isContractInfo = true;
          $ionicPopup.show({
            title: "<div class='vimgBar'><img src='img/vit1job-mini2.png'></div>",
            template: 'Veuillez remplir les données suivantes, elle seront utilisées dans le processus du contractualisation.',
            buttons: [
              {
                text: '<b>OK</b>',
                type: 'button-dark',
                onTap: function (e) {
                }
              }
            ]
          });
        } else {
          $scope.isContractInfo = false;
          $scope.title = "Saisie de la civilité";
          var employeur = localStorageService.get('currentEmployer');
          if (employeur) {
            // INITIALISATION FORMULAIRE
            if (employeur.titre){
              //$scope.formData.civ = employeur.titre;
              var civiliteArray = $.grep($scope.formData.civilites, function(e){ return e.libelle == employeur.titre; });
              $scope.formData.civilite = civiliteArray.length == 1 ?  civiliteArray[0]:"Titre";
            }
            if (employeur.nom)
              $scope.formData.nom = employeur.nom;
            if (employeur.prenom)
              $scope.formData.prenom = employeur.prenom;
            if (employeur.numSS)
              $scope.formData.numSS = employeur.numSS;
            if (employeur.cni)
              $scope.formData.cni = employeur.cni;
            if (employeur.nationalite){
              $scope.formData.nationalites.push(employeur.nationalite);
              $scope.formData.nationalite = employeur.nationalite;
            }
          }
        }
      }
    });
    $scope.updateCiviliteEmployeur = function () {

      var currentEmployer = localStorageService.get('currentEmployer');
      var employerId = currentEmployer.jobyerId;

      var titre = $scope.formData.civilite.libelle;
      var nom = $scope.formData.nom;
      var prenom = $scope.formData.prenom;
      var numSS = $scope.formData.numSS;
      var cni = $scope.formData.cni;
      var nationalite = '';
      var nationaliteId ='';
       console.log($scope.formData['nationalite']);
      if($scope.formData['nationalite'] != null  && $scope.formData['nationalite'].libelle!='Nationalité' && $scope.formData['nationalite'].libelle != undefined){
        nationalite = $scope.formData['nationalite'];
        nationaliteId = nationalite.natId;
      }


      if (titre || nom || prenom || cni || numSS || nationalite ) {
        if (!titre || titre=="Titre")
          titre = "";
        if (!nom)
          nom = "";
        if (!prenom)
          prenom = "";
        if (!cni)
          cni = "";
        if (!numSS)
          numSS = "";
        /*else {
          if (!$scope.siretValide) {
            var myPopup = $ionicPopup.show({
              template: "Le format du SIRET est incorrect <br>",
              title: "<div class='vimgBar'><img src='img/vit1job-mini2.png'></div>",
              buttons: [
                {
                  text: '<b>Non</b>',
                  type: 'button-dark'
                }
              ]
            });
            return;
          }

        }*/
        if(!nationaliteId)
          nationaliteId="";

        // UPDATE EMPLOYEUR
        UpdateInServer.updateCiviliteInEmployeur(titre, nom, prenom, numSS, cni, nationaliteId, employerId)
          .success(function (response) {

            // DONNEES ONT ETE SAUVEGARDES
            console.log("response" + response);

            var employeur = localStorageService.get('currentEmployer');
            if (!employeur)
              employeur = {};

            employeur.titre = titre;
            employeur.nom = nom;
            employeur.prenom = prenom;
            employeur.cni = cni;
            employeur.numSS = numSS;
            employeur.nationalite = nationalite;


            // PUT IN SESSION
            localStorageService.set('currentEmployer', employeur);

          }).error(function (err) {
            console.log("error : insertion DATA");
            console.log("error In updateCiviliteInEmployeur: " + err);
          });
      }

      // UPLOAD IMAGE
      if ($scope.formData.imageEncode) {

        // console.log("image name : "+$scope.formData.imageName);
        //console.log("image en base64 : "+$scope.formData.imageEncode);
        // console.log("image en base64 : "+$scope.formData.imageEncode);
        // ENVOI AU SERVEUR
        //UploadFile.uploadFile($scope.formData.imageName, $scope.formData.imageEncode.split(',')[1], employeId)
        UploadFile.uploadFile("user_employeur", $scope.formData.imageName, $scope.formData.imageEncode, employeId)
          .success(function (response) {

            // FILE A ETE BIEN TRANSFERE
            console.log("File est bien uploadé");
            console.log("response : " + response);

          }).error(function (err) {
            console.log("error : upload File");
            console.log("error In UploadFile.uploadFile(): " + err);
          });
      }

      // REDIRECTION VERS PAGE - ADRESSE PERSONEL
      if (steps) {
        console.log(steps);
        if (steps.step2) {
          $state.go('menu.infoTabs.adressePersonel');
        }
        else if (steps.step3) {
          $state.go('menu.infoTabs.adresseTravail');
        }
        else {
          $state.go('menu.contract');
        }

      }
      else {
        console.log("else" + steps);
        $state.go('menu.infoTabs.adressePersonel');
      }
    };


    $scope.selectImage = function () {
      /*onSuccess = function (imageURI) {
       $scope.imgURI = imageURI;
       $state.go($state.current, {}, {reload: true});
       }
       onFail = function (message) {
       console.log('An error occured: ' + message);
       }*/
      var options = {
        quality: 75,
        destinationType: Camera.DestinationType.DATA_URL,
        sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
        allowEdit: false,
        encodingType: Camera.EncodingType.JPEG,
        targetWidth: 100,
        targetHeight: 100
      };

      $cordovaCamera.getPicture(options).then(function (imageData) {
        $scope.imgURI = "data:image/jpeg;base64," + imageData;

        // console.log("imageURI : "+$scope.imgURI);
        //$state.go($state.current, {}, {reload: true});

      }, function (err) {
        console.log('An error occured: ' + message);
      });
    };
    /*
     $scope.selectImage = function() {
     console.log("selectImage");
     document.getElementById('image').click();
     };
     */
    $scope.loadImage = function (img) {

      // console.log("files.length : "+img.files.length);
      // console.log("files[0] : "+img.files[0]);

      function el(id) {
        var elem = document.getElementById(id);
        if (typeof elem !== 'undefined' && elem !== null) {
          return elem;
        }
      } // Get elem by ID

      if (img.files && img.files[0]) {

        var FR = new FileReader();
        FR.onload = function (e) {
          // RECUPERE FILE-NAME
          $scope.formData.imageName = img.files[0].name;
          // RECUPERE ENCODAGE-64
          $scope.formData.imageEncode = e.target.result;
        };
        FR.readAsDataURL(image.files[0]);
        //$scope.$apply(function(){});

        FR.onload = function (oFREvent) {
          document.getElementById("uploadPreview").src = oFREvent.target.result;
          $scope.imgURI = oFREvent.target.result;
          //$state.go($state.current, {}, {reload: true});
        };
      }
    };

    $scope.validatElement = function (id) {
      Validator.checkField(id);
    };

      $scope.validateNumSS= function(id){
        Validator.checkNumSS(id,$scope.formData.numSS);
        //$scope.numSSValide =false;
      };
    $scope.validateCni= function(id){
      Validator.checkCni(id,$scope.formData.cni);
      //$scope.numSSValide =false;
    };
      $scope.displayScanTitle= function(){
        if($scope.formData.nationalite.libelle!=null && $scope.formData.nationalite.libelle!="Nationalité"){
          if($scope.formData.nationalite.libelle =="Français")
            $scope.formData.scanTitle="de votre CNI";
          else
            $scope.formData.scanTitle="de votre autorisation de travail";
          //$scope.formData.nationaliteId = nationaliteId;
        }
      };

    $scope.initForm = function () {
      // GET LIST
      $scope.formData = {'civilites': DataProvider.getCivilites()};
      $scope.formData.civ = "Titre";
      $scope.formData.nationalites = DataProvider.getNationalite();

      // console.log('$scope.formData.civ = '+$scope.formData.civ);
      $scope.formData.nationalite = {"libelle":"Nationalité"};
    };

    /*$scope.$on("$ionicView.beforeEnter", function (scopes, states) {
      if (states.stateName == "menu.infoTabs.saisieCiviliteEmployeur") {
        $scope.initForm();
        var employeur = localStorageService.get('currentEmployer');
        if (employeur) {
          // INITIALISATION FORMULAIRE
          if (employeur.titre)
            $scope.formData.civ = employeur.titre;
          if (employeur.nom)
            $scope.formData.nom = employeur.nom;
          if (employeur.prenom)
            $scope.formData.prenom = employeur.prenom;
          if (employeur.numSS)
            $scope.formData.numSS = employeur.numSS;
          if (employeur.cni)
            $scope.formData.cni = employeur.cni;
          if (employeur.nationalite)
            $scope.formData.nationalite = employeur.nationalite;
        }
      }
    });*/

    $scope.takePicture = function () {

      // console.log("Je suis ds takePicture() ");
      var options = {
        quality: 75,
        destinationType: Camera.DestinationType.DATA_URL,
        sourceType: Camera.PictureSourceType.CAMERA,
        allowEdit: false,
        encodingType: Camera.EncodingType.JPEG,
        targetWidth: 100,
        targetHeight: 100,
        popoverOptions: CameraPopoverOptions,
        saveToPhotoAlbum: false,
        correctOrientation: true
      };

      $cordovaCamera.getPicture(options).then(function (imageData) {
        $scope.imgURI = "data:image/jpeg;base64," + imageData;
        // console.log("imageData : "+imageData);
        //$state.go($state.current, {}, {reload: true});
      }, function (err) {
        console.log(err);
      });
    };
    /*$scope.skipDisabled= function(){
     var employeur=localStorageService.get('currentEmployer');
     return $scope.isContractInfo && (!employeur || !employeur.entreprise[0].urssaf || !employeur.entreprise[0].naf || !employeur.entreprise[0].siret || !employeur.nom || !employeur.prenom || !employeur.entreprise[0].name || !employeur.titre);
     };*/
  });
