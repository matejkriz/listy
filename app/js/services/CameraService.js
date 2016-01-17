/*
 * CameraService
 *
 * @usage: expose API of cordova-plugin-camera for IOS, Android and W8.1 apps
 *
 * @doc: https://github.com/apache/cordova-plugin-camera
 *
 * @options:
 *		Quality				Number 	Quality of the saved image, range of 0 - 100, default: 50
 *		destinationType 	Number 	Format of the return value
 *		sourceType			Number 	Set the source of the picture
 *		allowEdit			Boolean Allow simple editing of image before selection
 *		encodingType		Number 	JPEG = 0, PNG = 1, default: JPEG
 *		targetWidth 		Number 	Width to scale image (pixels). Used with targetHeight
 *		targetHeight		Number 	Height to scale image (pixels). Used with targetHeight
 *		mediaType			String 	Set the type of media to select from
 *		cameraDirection 	Number 	Back = 0, Front-facing = 1
 *		popoverOptions		String 	iOS-only options that specify popover location in iPad
 *		saveToPhotoAlbum 	Boolean Save image to photo album on the device
 *
 * @example:
 *		CameraService.takePicture(options).then(function (response) {
 *			var image = response;
 *		});
 *  	CameraService.importPicture(options).then(function (response) {
 *			var image = response;
 *		});
 */

define(['angular'], function(angular) {
  "use strict";

  var factory = function($log, $q, $window) {
    function showWarning(){
      var deferred = $q.defer();
      $log.warn('Camera plugin is not available outside cordova app.');
      deferred.reject();
      return deferred.promise;
    }

    if (!$window.Camera) {
      showWarning();
      return {
        getPicture: showWarning,
        takePicture: showWarning,
        importPicture: showWarning
      };
    }

    var defaultOptions = {
      destinationType: Camera.DestinationType.DATA_URL,
      sourceType: Camera.PictureSourceType.CAMERA,
      mediaType: Camera.MediaType.PICTURE,
      allowEdit: true
    };

    function getPicture(options) {
      var deferred = $q.defer();

      if (!navigator.camera) {
        deferred.resolve(null);
        return deferred.promise;
      }

      options = getDefaultOptionsIfNoOptions(options);

      navigator.camera.getPicture(function(returnObj) {
        deferred.resolve(returnObj);
      }, function(error) {
        console.warn('CameraService: ' + error);
        deferred.reject(error);
      }, options);

      return deferred.promise;
    }

    function getDefaultOptionsIfNoOptions(options) {
      if (!options) {
        options = defaultOptions;
      }
      return options;
    }

    function takePicture(options) {
      options = getDefaultOptionsIfNoOptions(options);
      options.sourceType = Camera.PictureSourceType.CAMERA;
      return getPicture(options);
    }

    function importPicture(options) {
      options = getDefaultOptionsIfNoOptions(options);
      options.sourceType = Camera.PictureSourceType.PHOTOLIBRARY;
      return getPicture(options);
    }

    return {
      getPicture: getPicture,
      takePicture: takePicture,
      importPicture: importPicture
    };
  };

  factory.$inject = ['$log', '$q', '$window'];
  return factory;
});
