(function() {
  'use strict';
  define(function(require) {

    var angular = require('angular'),
      services = angular.module('listy.services', ['restangular']);

    services.service('api', require('services/RestAPIService'));
    services.service('Camera', require('services/CameraService'));
    services.service('Canvas', require('services/CanvasService'));
    services.service('Contours', require('services/ContoursService'));
    services.service('CV', require('services/CVService'));
    services.service('Feat', require('services/JSFeatService'));
    services.service('FileReader', require('services/FileReaderService'));
    services.service('ImageEdit', require('services/ImageEditService'));
    services.service('TreeService', require('services/TreeService'));

    services.filter('trusted', require('services/TrustedFilter'));

    return services;

  });
})();
