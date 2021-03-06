// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {

    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleLightContent();
    }
    
  });
})

.filter('html',function($sce){
    var div = document.createElement('div');
    return function(input){
        div.innerHTML = input;
        return $sce.trustAsHtml(div.textContent);
    }
})


.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  // setup an abstract state for the tabs directive
    .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html'
  })

  // Each tab has its own nav history stack:

  .state('tab.lookup', {
    url: '/lookup',
    views: {
      'tab-lookup': {
        templateUrl: 'templates/tab-lookup.html',
        controller: 'LookupCtrl'
      }
    }
  })

  .state('tab.churches', {
      url: '/churches',
      views: {
        'tab-churches': {
          templateUrl: 'templates/tab-churches.html',
          controller: 'ChurchesCtrl'
        }
      }
    })
    .state('tab.chat-detail', {
      url: '/church/:churchID',
      views: {
        'tab-churches': {
          templateUrl: 'templates/chat-detail.html',
          controller: 'ChurchDetailCtrl'
        }
      }
    })

  .state('tab.denominations', {
    url: '/denominations',
    views: {
      'tab-denominations': {
        templateUrl: 'templates/tab-denominations.html',
        controller: 'DenominationsCtrl'
      }
    }
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/lookup');

});
