angular.module('starter.services', [])

.factory('Churches', function($http, Settings) {
    // Might use a resource here that returns a JSON array

  var obj = {};

  obj.get = function(id) {
     return $http.get('https://nearestchurch.com/api/church?id=' + id);
  }

  obj.lookup = function() {

  	var latitude = Settings.get('latitude');
  	var longitude = Settings.get('longitude');
    var denom = Settings.get('denominations');
    var denominations = [];
    angular.forEach(denom, function(value, key) {
      if (value.checked == true) {
        denominations.push(value.slug);
      }
    });
    denominations = denominations.join();
    return $http.get('https://nearestchurch.com/api/nearbyChurches?latitude=' + latitude + '&longitude=' + longitude + '&denominations=' + denominations);

  }
  return obj;

})

.factory('Denominations', function($http) {

  var obj = {};

  obj.all = function() {

    return $http.get('https://nearestchurch.com/api/denominations');

  }
  return obj;

})


.factory('Settings', ['$window', function($window) {
  return {
    set: function(key, value) {

      if (typeof value === 'object') {
      	$window.localStorage[key] = JSON.stringify(value);
      } else {
      	$window.localStorage[key] = value;
      }
    },
    get: function(key, defaultValue) {
      value = $window.localStorage[key] || defaultValue;
      try {
		return JSON.parse(value);
	   } catch(e) {
		return value;
	   }
    },
  }
}])

  .factory('AddressLookupSvc', [
    '$q', '$http',
    function($q, $http) {
      //TODO: API KEY
      var MAPS_ENDPOINT = 'https://maps.google.com/maps/api/geocode/json?{PARAMATER}&sensor=false';

      return {
        urlForReverseGeocode: function(lat, lng) {
          return MAPS_ENDPOINT.replace('{PARAMATER}', 'latlng=' + lat + ',' + lng);
        },

        reverseGeocode: function(lat, lng) {
          var deferred = $q.defer();
          var url = this.urlForReverseGeocode(lat, lng);

          $http.get(url).success(function(response) {
            deferred.resolve(response.results);
          }).error(deferred.reject);

          return deferred.promise;
        },

        urlForGeocode: function(address) {
          address = encodeURIComponent(address);
          return MAPS_ENDPOINT.replace('{PARAMATER}', 'address=' + address);
        },

        geocode: function(address) {
          var deferred = $q.defer();
          var url = this.urlForGeocode(address);

          $http.get(url).success(function(response) {
            deferred.resolve(response.results);
          }).error(deferred.reject);

          return deferred.promise;
        },



      };
    }
  ]);
