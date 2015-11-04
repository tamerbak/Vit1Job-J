/**
 * Created by Tamer on 09/10/2015.
 */
'use strict';

starter
  .controller('searchCtrl', function ($scope, $rootScope,$state, $http, x2js, $cookieStore, localStorageService, Global) {

    $scope.mfbMenuState = 'open';
    $scope.search = $rootScope.queryText;

    /**
     *
     */
    $scope.checkGeoLocalisation = function() {
      var cnx = $cookieStore.get('connexion');
      console.log("connexion = ", cnx);
      if (cnx && cnx.etat) {
        console.log("Employeur est connecté", cnx);
      }
      else {
        console.log("Employeur non connecté", cnx);
        var confirmPopup = Global.showCopyAddress("Votre géolocalisation pour trouver des jobyers à proximité?");
        confirmPopup.then(function (res) {
          if (res) {
            console.log('You are sure');

            // onSuccess Callback
            // This method accepts a Position object, which contains the
            // current GPS coordinates
            //
            var onSuccess = function (position) {
              alert('Latitude: ' + position.coords.latitude + '\n' +
                'Longitude: ' + position.coords.longitude + '\n' +
                'Altitude: ' + position.coords.altitude + '\n' +
                'Accuracy: ' + position.coords.accuracy + '\n' +
                'Altitude Accuracy: ' + position.coords.altitudeAccuracy + '\n' +
                'Heading: ' + position.coords.heading + '\n' +
                'Speed: ' + position.coords.speed + '\n' +
                'Timestamp: ' + position.timestamp + '\n');

              var userGeoAddr = {
                'latitude'  : position.coords.latitude,
                'longitude' : position.coords.longitude,
                'altitude'  : position.coords.altitude
              };
              localStorageService.set('user_geo_addr', userGeoAddr);

              var geocoder = new google.maps.Geocoder();
              var latlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
              geocoder.geocode({'latLng': latlng}, function (results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                  if (results[0]) {

                    userGeoAddr.address = results[0].formatted_address;
                    localStorageService.set('user_geo_addr', userGeoAddr);
                    console.log(results[0].formatted_address);
                    console.log(results);
                    return results[0].formatted_address;
                  } else {
                    alert('Location not found');
                  }
                } else {
                  alert('Geocoder failed due to: ' + status);
                }
              });
            };

            // onError Callback receives a PositionError object
            //
            var onError = function onError(error) {
              alert('code: ' + error.code + '\n' +
                'message: ' + error.message + '\n');
            };

            navigator.geolocation.getCurrentPosition(onSuccess, onError);

          } else {
            console.log('You are not sure');
          }
        });
      }
    };

    $scope.checkGeoLocalisation();


    /**
     * Calculate distance
     * @param lat1
     * @param lon1
     * @returns {*}
     */
    var getDistance = function(lat1, lon1) {

      console.log();
      var userGeoAddr = localStorageService.get('user_geo_addr');

      if(!userGeoAddr) {
        return null;
      }

      var lat2 = userGeoAddr.latitude;
      var lon2 = userGeoAddr.longitude;


      var R = 6371; // km
      //has a problem with the .toRad() method below.
      var x1 = lat2-lat1;

      var dLat = toRad(x1);
      var x2 = lon2-lon1;
      var dLon = toRad(x2);
      var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
        Math.sin(dLon/2) * Math.sin(dLon/2);
      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      var d = R * c;

      return d;
    };

    /** Converts numeric degrees to radians */
    var toRad = function(value) {
      return value * Math.PI / 180;
    };

    /**
     *
     * @param search
     */
    $scope.onSearchChange = function (search) {

      var d = getDistance(33.572654, -7.593298);
      console.log("Distance = ", d);

      /*$scope.mfbMenuState = 'closed';*/
      var jobyersForMe = [];
      var jobyersNextToMe = [];

      if ( search == ''){
        $rootScope.jobyersForMe = [];
        $rootScope.nbJobyersForMe = 0;
        $rootScope.nbJobyersNextToMe = 0;
        $rootScope.jobyersNextToMe = [];
        $scope.mfbMenuState = 'open';
        return;
      }


      if (sessionId != '') {
        var soapMessage = 'user_salarie;' + search; //'C# sur paris';
        $http({
          method: 'POST',
          url: 'http://ns389914.ovh.net:8080/vit1job/api/recherche',
          headers: {
            "Content-Type": "text/plain"
          },
          data: soapMessage
        }).then(
          function(response) {
            var jsonResp = x2js.xml_str2json(response.data);
            var jsonText = JSON.stringify (jsonResp);
            jsonText = jsonText.replace(/fr.protogen.connector.model.DataModel/g,"dataModel");
            jsonText = jsonText.replace(/fr.protogen.connector.model.DataRow/g,"dataRow");
            jsonText = jsonText.replace(/fr.protogen.connector.model.DataEntry/g,"dataEntry");
            jsonText = jsonText.replace(/fr.protogen.connector.model.DataCouple/g, "dataCouple");
            jsonText = jsonText.replace(/<!\[CDATA\[/g, '').replace(/\]\]\>/g,'');
            jsonResp = JSON.parse(jsonText);

            //Check if there are rows!
            if (jsonResp.dataModel.rows.dataRow instanceof Array){
              for (var i = 0; i < jsonResp.dataModel.rows.dataRow.length; i++) {
                jsonText = JSON.stringify(jsonResp);
                jsonText = jsonText.replace("fr.protogen.connector.model.DataModel", "dataModel");
                jsonText = jsonText.replace("fr.protogen.connector.model.DataRow", "dataRow");
                jsonText = jsonText.replace("fr.protogen.connector.model.DataEntry", "dataEntry");
                jsonText = jsonText.replace("fr.protogen.connector.model.DataCouple", "dataCouple");
                jsonResp = JSON.parse(jsonText);

                //jsonResp.dataModel.rows.dataRow[0].dataRow.dataEntry[1].value
                var prenom = jsonResp.dataModel.rows.dataRow[i].dataRow.dataEntry[1].value;
                var nom = jsonResp.dataModel.rows.dataRow[i].dataRow.dataEntry[2].value;
                var coordLambert = jsonResp.dataModel.rows.dataRow[i].dataRow.dataEntry[5].value;

                prenom = prenom.replace("<![CDATA[",'');
                prenom = prenom.replace("]]>",'');
                nom = nom.replace("<![CDATA[",'');
                nom = nom.replace("]]>",'');
                coordLambert = coordLambert.replace("<![CDATA[",'');
                coordLambert = coordLambert.replace("]]>",'');

                var jobyerLat = '';
                var jobyerLong = '';
                if (coordLambert.indexOf(",") > -1){
                  jobyerLat = coordLambert.split (',')[0];
                  jobyerLong = coordLambert.split (',')[1];
                }

                jobyersForMe.push({
                    'firstName': prenom,
                    'lastName': nom,
                    'lat': 48.717132, //jobyerLat,
                    'long': 2.245816 //jobyerLong
                  });
              }
            } else {
              //One Instance returned or null!
              if (jsonResp.dataModel.rows!=""){
                prenom = jsonResp.dataModel.rows.dataRow.dataRow.dataEntry[1].value;
                nom = jsonResp.dataModel.rows.dataRow.dataRow.dataEntry[2].value;
                coordLambert = jsonResp.dataModel.rows.dataRow.dataRow.dataEntry[5].value;

                prenom = prenom.replace("<![CDATA[",'');
                prenom= prenom.replace("]]>",'');
                nom = nom.replace("<![CDATA[",'');
                nom = nom.replace("]]>",'');
                coordLambert = coordLambert.replace("<![CDATA[",'');
                coordLambert = coordLambert.replace("]]>",'');

                if (coordLambert.indexOf(",") > -1){
                  jobyerLat = coordLambert.split (',')[0];
                  jobyerLong = coordLambert.split (',')[1];
                }

                jobyersForMe[0] = {
                  'firstName': prenom,
                  'lastName': nom,
                  'lat': jobyerLat,
                  'long': jobyerLong
                };
              } else {
                $rootScope.jobyersForMe = [];
                $rootScope.nbJobyersForMe = 0;
                $rootScope.nbJobyersNextToMe = 0;
                $rootScope.jobyersNextToMe = [];
                $scope.mfbMenuState = 'open';
                return;
              }
            }

            //sessionId = jsonResp.amanToken.sessionId;*/
            //console.log($scope.firstName + " " + $scope.secondName);

            $rootScope.jobyersForMe = jobyersForMe;
            $rootScope.nbJobyersForMe = jobyersForMe.length;

            // Send Http search to get jobbers with same competencies and same city as mine
            for (i=0; i < jobyersForMe.length ; i++){
              var proximity = getDistance(jobyersForMe[i].lat, jobyersForMe[i].long);
              proximity = proximity.toFixedDown(2);
              console.log(proximity);
              if (proximity <= 10) { // à proximité de 10Km
                jobyersNextToMe.push({
                  'firstName': jobyersForMe[i].firstName,
                  'lastName': jobyersForMe[i].lastName,
                  'proximity': proximity
                });
              }
            }
            $rootScope.jobyersNextToMe = jobyersNextToMe;
            $rootScope.nbJobyersNextToMe= jobyersNextToMe.length;
            $scope.mfbMenuState = 'open';
          },
          function(response){
            $rootScope.jobyersForMe = [];
            $rootScope.nbJobyersForMe = 0;
            $rootScope.nbJobyersNextToMe = 0;
            $rootScope.jobyersNextToMe = [];
            $scope.mfbMenuState = 'open';
            alert("Error : "+response.data);
          }
        );
      }
    };

    $scope.isNoJobyerForMe = function() {
      if ($scope.nbJobyersForMe != 0){
        $state.go('list');
      }
    };

    $scope.isNoJobyerNextToMe = function() {
      if ($scope.nbJobyersNextToMe != 0){
        $state.go('listNext');
      }
    };

    Number.prototype.toFixedDown = function(digits) {
      var re = new RegExp("(\\d+\\.\\d{" + digits + "})(\\d)"),
        m = this.toString().match(re);
      return m ? parseFloat(m[1]) : this.valueOf();
    };
  })
;
