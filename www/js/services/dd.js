// initialisation
app.run(function ($ionicPlatform, $cordovaGeolocation, geoLocation, $rootScope, defaultLocalisation, $ionicPopup) {
  // waiting the platform ready event
  $ionicPlatform.ready(function () {
    $cordovaGeolocation
      .getCurrentPosition()
      .then(function (position) {
        geoLocation.setGeolocation(position.coords.latitude, position.coords.longitude);
      }, function (err) {
        // you need to enhance that point
        $ionicPopup.alert({
          title: 'Ooops...',
          template: err.message
        });

        geoLocation.setGeolocation(defaultLocalisation.latitude, defaultLocalisation.longitude)
      });

    // begin a watch
    var watch = $cordovaGeolocation.watchPosition({
      frequency: 1000,
      timeout: 3000,
      enableHighAccuracy: false
    }).then(function () {
      }, function (err) {
        // you need to enhance that point
        geoLocation.setGeolocation(defaultLocalisation.latitude, defaultLocalisation.longitude);
      }, function (position) {
        geoLocation.setGeolocation(position.coords.latitude, position.coords.longitude);
        // broadcast this event on the rootScope
        $rootScope.$broadcast('location:change', geoLocation.getGeolocation());
      }
    );
  });
})
