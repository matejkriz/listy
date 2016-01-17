(function() {
  'use strict';
  define([
    'angular',
    'uiRouter',
    'controllers/controllers',
    'directives/directives',
    'services/services',
    'ionicAngular',
    'jsfeat'
  ], function(
    angular,
    uiRouter
  ) {
    try {
      angular.module('html_template');
    } catch (e) {
      // for development, if not exist, create empty templates
      angular.module('html_template', []);
    }

    angular.module('listy', ['ionic', 'listy.controllers', 'listy.directives', 'listy.services', 'ui.router', 'restangular'])

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
            StatusBar.styleDefault();
          }
        });
      })
      .constant('API', {
        url: 'http://localhost:3000/api/',
        images: 'http://localhost:3000/images/'
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

      .state('tab.recognize', {
        url: '/recognize',
        views: {
          'tab-recognize': {
            templateUrl: 'templates/recognize.html',
            controller: 'recognizeCtrl as vm'
          }
        }
      })

      .state('tab.trees', {
          url: '/trees',
          views: {
            'tab-trees': {
              templateUrl: 'templates/trees.html',
              controller: 'treesCtrl as vm'
            }
          }
        })
        .state('tab.treeDetail', {
          url: '/trees/:treeId',
          views: {
            'tab-trees': {
              templateUrl: 'templates/treeDetail.html',
              controller: 'treeDetailCtrl as vm'
            }
          }
        });

      // if none of the above states are matched, use this as the fallback
      $urlRouterProvider.otherwise('/tab/recognize');

    });

  });
})();
