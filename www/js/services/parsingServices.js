/**
 * Created by Tamer on 14/10/2015.
 */

angular.module('parsingServices', ['ionic', 'cb.x2js'])

  .factory('xmlParser', function () {
    var x2js = new X2JS();
    return {
      xml2json: function (args) {
        return angular.bind(x2js, x2js.xml2json, args)();
      },

      xml_str2json: function (args) {
        return angular.bind(x2js, x2js.xml_str2json, args)();
      },
      json2xml_str: function (args) {
        return angular.bind(x2js, x2js.json2xml_str, args)();
      }
    }
  })
  .factory('formatString', function(xmlParser){
    return{
      formatServerResult: function (data){

        var jsonResp = xmlParser.xml_str2json(data);
        var jsonText = JSON.stringify(jsonResp);

        jsonText = jsonText.replace("fr.protogen.connector.model.DataModel", "dataModel");
        jsonText = jsonText.replace("fr.protogen.connector.model.DataRow", "dataRow");
        jsonText = jsonText.replace("fr.protogen.connector.model.DataEntry", "dataEntry");
        jsonText = jsonText.replace("fr.protogen.connector.model.DataCouple", "dataCouple");
        jsonText = jsonText.replace( /<!\[CDATA\[/g, '').replace( /\]\]>/g, "");


        jsonText = JSON.parse(jsonText);
        return jsonText;
      }
    }
  })
