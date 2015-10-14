/**
 * Created by Tamer on 14/10/2015.
 */

angular.module('wsConnectors', ['ionic'])

  .service('AuthentificatInServer', function ($http){
    this.pullSessionId=function(){

      var soapMessage=
        '<fr.protogen.connector.model.AmanToken>'+
        '<username>administrateur</username>'+
        '<password>1234</password>'+
        '<nom></nom>'+
        '<appId>FRZ48GAR4561FGD456T4E</appId>'+
        '<sessionId></sessionId>'+
        '<status></status>'+
        '<id>0</id>'+
        '<beanId>0</beanId>'+
        '</fr.protogen.connector.model.AmanToken>';
      //console.log(soapMessage);

      return $http({
        method: 'POST',
        url: 'http://ns389914.ovh.net:8080/vit1job/api/aman',
        headers: {
          "Content-Type": "text/xml"
        },
        data: soapMessage
      });
    };
  })

  .service('PullDataFromServer', function ($http){
      this.pullDATA=function(entity, sessionId, field, gt, lt){
        sopMessage = '<fr.protogen.connector.model.DataModel>'+
          '<entity>'+entity+'</entity>'+
          '<dataMap/><rows />'+
          '<token>'+
          '<username/>'+
          '<password/>'+
          '<nom>Jakjoud Abdeslam</nom>'+
          '<appId>FRZ48GAR4561FGD456T4E</appId>'+
          '<sessionId>'+sessionId+'</sessionId>'+
          '<status>SUCCES</status>'+
          '<id>206</id>'+
          '<beanId>0</beanId>'+
          '</token>'+
          '<expired></expired>'+
          '<unrecognized></unrecognized>'+
          '<status></status>'+
          '<operation>GET</operation>'+
          '<clauses>'+
          '<fr.protogen.connector.model.SearchClause>'+
          '<field>'+field+'</field>'+
          '<clause></clause>'+
          '<gt>'+gt+'</gt>'+
          '<lt>'+lt+'</lt>'+
          '<type>TEXT</type>'+
          '</fr.protogen.connector.model.SearchClause>'+
          '</clauses>'+
          '<page>1</page>'+
          '<pages>5</pages>'+
          '<nbpages>0</nbpages>'+
          '<iddriver>0</iddriver>'+
          '<ignoreList></ignoreList>'+
          '</fr.protogen.connector.model.DataModel>';

        // ENVOI AU SERVEUR
        return $http({
          method: 'POST',
          url: 'http://ns389914.ovh.net:8080/vit1job/api/das',
          headers: {
            "Content-Type": "text/xml"
          },
          data: sopMessage
        });
      }
    })


