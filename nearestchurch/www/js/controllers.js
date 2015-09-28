angular.module('starter.controllers', [])



.controller('LookupCtrl', function($scope, $state, $ionicLoading, Settings, AddressLookupSvc) {

  $scope.currentLocation = function() {

      $ionicLoading.show({
        content: 'Loading',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 200,
        showDelay: 0
      });
    Settings.set('lookuptype','current');
    navigator.geolocation.getCurrentPosition(success, error, options);

  };

  $scope.otherLocation = function(address_input) {
      $ionicLoading.show({
        content: 'Loading',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 200,
        showDelay: 0
      });

      Settings.set('lookuptype','other');
      AddressLookupSvc.geocode(address_input).then(function(address) {
        var pos = {};
        pos.coords = address[0].geometry.location;
        pos.coords.latitude = pos.coords.lat;
        pos.coords.longitude = pos.coords.lng;
        success(pos);
      }, function(err) {
        alert(err);
        $scope.message = err;
      });
  };

  var options = {
      enableHighAccuracy: false,
      timeout: 5000,
      maximumAge: 0
    };

  function success(pos) {
    var crd = pos.coords;
    var newLatitude = parseFloat(crd.latitude).toFixed(4);
    var newLongitude = parseFloat(crd.longitude).toFixed(4);
    var currentLatitude = parseFloat(Settings.get('latitude')).toFixed(4);
    var currentLongitude = parseFloat(Settings.get('longitude')).toFixed(4);
    
    if (newLatitude != currentLatitude || newLongitude!=currentLongitude) {
      Settings.set('changed',1);
    } 
    Settings.set('latitude',newLatitude);
    Settings.set('longitude',newLongitude);
    Settings.set('accuracy',crd.accuracy);
    $ionicLoading.hide();
    $state.go('tab.churches');

    AddressLookupSvc.reverseGeocode(newLatitude,newLongitude).then(function(address) {
      $scope.address = address;
      Settings.set('address',address[0].formatted_address);
    }, function(err) {
      alert(err);
      $scope.message = err;
    });
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
    if (Settings.get('changed')==1 || $scope.churches === undefined || 1==1) {
      $ionicLoading.show({
        content: 'Loading',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 200,
        showDelay: 0
      });
      Churches.lookup().success(function(response){
        $scope.churches = response.churches;
        if (Settings.get('lookuptype') == 'current') {
          $scope.address = 'your current location of ' + Settings.get('address');
        } else {
          $scope.address = Settings.get('address');
        }
        
        Settings.set('changed',0);
        $ionicLoading.hide();
      });

      var denominations_settings = Settings.get('denominations');
      var denominations = [];
      angular.forEach(denominations_settings, function(value, key) {
        if (value.checked) {
          denominations.push(value.name);
        }
      });
      $scope.denominations = denominations.join(', ');
    }

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
