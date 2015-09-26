angular.module('starter.services', [])

.factory('Churches', function($http, Settings) {
    // Might use a resource here that returns a JSON array

  var obj = {};

  obj.all = function() {

    return $http.get('http://nearestchurch.com/api/nearbyChurches?latitude=38.813778899999996&longitude=-77.1096117&denominations=');

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
    return $http.get('http://nearestchurch.com/api/nearbyChurches?latitude=' + latitude + '&longitude=' + longitude + '&denominations=' + denominations);

  }
  return obj;

})

.factory('Denominations', function($http) {

  var obj = {};

  obj.all = function() {

    return $http.get('http://nearestchurch.com/api/denominations');

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
}]);
