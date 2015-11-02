/**
 * Created by HODAIKY on 24/10/2015.
 */
'use strict';

angular.module('connexionPhoneServices', ['ionic'])

  .service('Countries', function ($http){

    this.getAll = function (sessionID) {
      var soapMessage =
        '<fr.protogen.connector.model.DataModel>' +
        '<entity>user_pays</entity>' +
        '<dataMap/>' +
        '<rows/>' +
        '<token>' +
        '<username></username>' +
        '<password></password>' +
        '<nom>Jakjoud Abdeslam</nom>' +
        '<appId>FRZ48GAR4561FGD456T4E</appId>' +
        '<sessionId>' + sessionID + '</sessionId>' +
        '<status>SUCCES</status>' +
        '<id>206</id>' +
        '<beanId>0</beanId>' +
        '</token>' +
        '<expired></expired>' +
        '<unrecognized></unrecognized>' +
        '<status></status>' +
        '<operation>GET</operation>' +
        '<clauses/>' +
        '<page>1</page>' +
        '<pages>24</pages>' +
        '<nbpages>30</nbpages>' +
        '<iddriver>0</iddriver>' +
        '<ignoreList></ignoreList>' +
        '</fr.protogen.connector.model.DataModel>';

      return $http({
        method: 'POST',
        url: 'http://ns389914.ovh.net:8080/vit1job/api/das',
        headers: {
          "Content-Type": "text/xml"
        },
        data: soapMessage
      });
    }
  });
