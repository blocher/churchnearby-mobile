angular.module('starter.controllers', [])



.controller('LookupCtrl', function($scope, $state, $ionicLoading, Settings) {

  console.log(Settings.get('denominations'));
  $scope.currentLocation = function() {

      $ionicLoading.show({
        content: 'Loading',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 200,
        showDelay: 0
      });

    navigator.geolocation.getCurrentPosition(success, error, options);

  };

  var options = {
      enableHighAccuracy: false,
      timeout: 5000,
      maximumAge: 0
    };

    function success(pos) {

      var crd = pos.coords;
      var newLatitude = parseFloat(crd.latitude).toFixed(3);
      var newLongitude = parseFloat(crd.longitude).toFixed(3);
      var currentLatitude = parseFloat(Settings.get('latitude')).toFixed(3);
      var currentLongitude = parseFloat(Settings.get('longitude')).toFixed(3);
      
      if (newLatitude != currentLatitude || newLongitude!=currentLongitude) {
        Settings.set('changed',1);
      } 
      Settings.set('latitude',newLatitude);
      Settings.set('longitude',newLongitude);
      Settings.set('accuracy',crd.accuracy);

      $ionicLoading.hide();
      $state.go('tab.churches');


    };

    function error(err) {
      alert('We could not find your location.  Please try looking up an address instead.');
      $ionicLoading.hide();
    };

    

})

.controller('ChurchesCtrl', function($scope, Churches, $ionicLoading, Settings) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.$on('$ionicView.enter', function(e) {
    if (Settings.get('changed')==1 || $scope.churches === undefined) {
      $ionicLoading.show({
        content: 'Loading',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 200,
        showDelay: 0
      });
      Churches.lookup().success(function(response){
        $scope.churches = response.churches;
        Settings.set('changed',0);
        $ionicLoading.hide();
      });
    }

    console.log(Settings.get('denominations'));

  });
  
  

    
  
})

.controller('ChatDetailCtrl', function($scope, $q, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('DenominationsCtrl', function($scope, Settings, Denominations) {
  $scope.settings = {
    enableFriends: true
  };

  Denominations.all().success(function(response){
        var denominations = response.denominations;
        if (Settings.get('denominations') === undefined) {
          angular.forEach(denominations, function(value, key) {
            denominations[key].checked = true;
          });
        } else {
          var denominations_settings = Settings.get('denominations');
          angular.forEach(denominations_settings, function(value, key) {
            angular.forEach(denominations, function(d_value, d_key) {
              if (d_value.slug == value.slug) {
                denominations[key].checked = denominations_settings[key].checked;
              }
            });
          });
        }
        $scope.denominations = denominations;
        Settings.set('denominations',denominations);
    });

  $scope.denominationChanged = function(denomination) {
    var denominations = Settings.get('denominations');
    angular.forEach(denominations, function(value, key) {
        if (value.slug == denomination.slug) {
          denominations[key].checked = denomination.checked;
        }

    });
    Settings.set('changed',1);
    Settings.set('denominations',denominations);
  };

});
