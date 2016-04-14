/**
 * Created by mourad sadiq on 12/6/2015.
 */
'use strict';

starter.controller('contractCtrl', function ($scope, localStorageService, $stateParams, DataProvider, $ionicActionSheet, $ionicPopup, $state, $cordovaPrinter, AuthentificatInServer) {


  var payload = localStorageService.get('payload');

  $scope.showiFrame = true;
  var link = payload.url;
  console.log("lien youfign "+link);//youSign.iFrameURLs[0].iFrameURL ;
  //"https://demo.yousign.fr/public/cosignature/fBIcrK6aJgL5J3NXSvFxyLMve18Zw9LqJHXVtGJd?tpl=e9ecb0d279aaed5495890bfc84020501";
  var iframe = document.createElement('iframe');
  iframe.frameBorder = 0;
  iframe.width = "100%";
  iframe.height = "100%";
  iframe.id = "youSign";
  iframe.style.overflow =  "hidden";
  iframe.style.height =  "100%";
  iframe.style.width = "100%";
  iframe.setAttribute("src", link);
  $(iframe).appendTo($("#iframPlaceHolder"));

  $scope.$on('$ionicView.beforeEnter', function (event, viewData) {

    viewData.enableBack = true;
    $scope.showiFrame = false;

    var payload = localStorageService.get('payload');

    $scope.showiFrame = true;
    var link = payload.url;
    console.log("lien yousign " + link);//youSign.iFrameURLs[0].iFrameURL ;
    //"https://demo.yousign.fr/public/cosignature/fBIcrK6aJgL5J3NXSvFxyLMve18Zw9LqJHXVtGJd?tpl=e9ecb0d279aaed5495890bfc84020501";
    var iframe = document.createElement('iframe');
    iframe.frameBorder = 0;
    iframe.width = "100%";
    iframe.height = "100%";
    iframe.id = "youSign";
    iframe.style.overflow =  "hidden";
    iframe.style.height =  "100%";
    iframe.style.width = "100%";
    iframe.setAttribute("src", link);
    $(iframe).appendTo($("#iframPlaceHolder"));
  });



  //document.addEventListener("deviceready", $scope.showAlert, false);
});
