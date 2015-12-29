requirejs.config({
  paths: {
    angular: '../lib/ionic/js/angular/angular.min',
    angularAnimate: '../lib/ionic/js/angular/angular-animate.min',
    angularGettext: '../../node_modules/angular-gettext/dist/angular-gettext.min',
    angularSanitize: '../lib/ionic/js/angular/angular-sanitize.min',
    uiRouter: '../lib/ionic/js/angular-ui/angular-ui-router.min',
    ionic: '../lib/ionic/js/ionic.min',
    ionicAngular: '../lib/ionic/js/ionic-angular.min',
    jquery: '../../node_modules/jquery/dist/jquery.min',
    lodash: '../../node_modules/lodash/index',
    restangular: '../../node_modules/restangular/dist/restangular.min',
    text: '../lib/ionic/js/text',
    'tmh.dynamicLocale': '../../node_modules/angular-dynamic-locale/dist/tmhDynamicLocale.min'
  },
  shim: {
    jquery: {
      exports: '$'
    },
    lodash: {
      exports: '_'
    },
    angular: {
      exports: 'angular'
    },
    angularAnimate: {
      deps: ['angular']
    },
    angularSanitize: {
      deps: ['angular']
    },
    uiRouter: {
      deps: ['angular']
    },
    ionic: {
      deps: ['angular'],
      exports: 'ionic'
    },
    ionicAngular: {
      deps: ['angular', 'ionic', 'uiRouter', 'angularAnimate', 'angularSanitize']
    },
    angularGettext: {
      deps: ['angular', 'jquery']
    },
    restangular: {
      deps: ['angular', 'lodash']
    },
    'tmh.dynamicLocale': {
      deps: ['angular']
    }
  },
  priority: [
    'angular',
    'ionic'
  ],
  deps: [
    'bootstrap'
  ]
});
