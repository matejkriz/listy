(function() {
  'use strict';
  define(['Hammer'], function(Hammer) {
    return ['$scope', 'Camera', 'Canvas', 'api', 'Feat', 'FileReader', 'Contours', 'ImageEdit', '$timeout', '$window', function($scope, Camera, Canvas, api, Feat, FileReader, Contours, ImageEdit, $timeout, $window) {
      var vm = this;

      vm.padding = 15;
      vm.windowWidth = $window.innerWidth;
      var size = Math.floor(vm.windowWidth / 2 - vm.padding);
      vm.canvas = {
        width: size,
        height: size
      };

      vm.options = {
        blurRadius: 5,
        blurRadius2: 2,
        from: 0,
        to: 1,
        pathLength: Math.floor(vm.windowWidth - vm.padding),
        pathHeight: Math.floor(vm.windowWidth / 1.618),
        treshold: 10
      };

      var img;
      var cannyCtx;
      var previewCtx;
      var height;
      var width;

      vm.drawContoursPaths = drawContoursPaths;
      vm.getFile = getFile;
      vm.reprocessCanny = reprocessCanny;
      vm.takePicture = takePicture;

      // TODO: remove this for production
      drawImages('img/test.jpg', 'previewCanvas');

      function getFile(file) {
        FileReader.readAsDataUrl(file, $scope)
          .then(function(result) {
            vm.imageSrc = result;
            // console.log("result = ", result);
            drawImages(result, 'previewCanvas');
          });
      }

      function takePicture() {
        // console.log('takePicture!');
        Camera.takePicture().then(function(neco) {
          setTimeout(function() {
            // console.log('neco = ', neco);
          }, 0);
        });
      }

      function drawImages(image, canvasID) {
        previewCtx = Canvas.getContext(canvasID);
        Canvas.canvasClear(previewCtx);

        img = new Image();

        img.onload = function() {

          width = vm.canvas.width;
          vm.canvas.height = Math.floor(vm.canvas.width * (img.height / img.width));
          height = vm.canvas.height;
          previewCtx.canvas.height = height;
          if (!!cannyCtx) {
            cannyCtx.canvas.height = height;
            Canvas.canvasClear(cannyCtx);
          }
          ImageEdit.init(previewCtx, img, width, height);

          previewCtx.drawImage(img, 0, 0, width, height);

          reprocessCanny(0);
        };
        img.src = image;
      }

      function getLongest(arrayOfArrays) {
        var indexOfLongest = 0;
        for (var i = 0; i < arrayOfArrays.length; i++) {
          if (arrayOfArrays[indexOfLongest].length < arrayOfArrays[i].length) {
            indexOfLongest = i;
          }
        }
        return [arrayOfArrays[indexOfLongest]];
      }


      function drawCanny(imageData, width, height, canvasID) {
        var imgU8 = Feat.getMatrix(width, height);
        cannyCtx = Canvas.getContext(canvasID);

        var options = {
          lowThreshold: 10,
          highThreshold: 100,
          blurRadius: vm.options.blurRadius,
          blurRadius2: vm.options.blurRadius2
        };

        var imgResult = Feat.canny(imageData, width, height, imgU8, options);

        Canvas.renderImageData(imgResult.imageData, imgResult.imgU8, cannyCtx);
        return imgResult;
      }
      var timeout;
      function reprocessCanny(delay) {
        $timeout.cancel(timeout);
        timeout = $timeout(function(){
          console.log("reprocessCanny");
          // FIXME: new image disappearing after reprocess
          var imageData = previewCtx.getImageData(0, 0, width, height);
          var canny = drawCanny(imageData, width, height, 'cannyCanvas');
          drawContours(canny);
        }, delay || 500);

      }

      function drawContours(canny) {
        var pathCtx = Canvas.getContext('pathCanvas');
        Canvas.canvasClear(pathCtx);

        var cannyCanvas = document.getElementById('cannyCanvas');
        var contours = Contours.findContours(cannyCanvas, 100, 0, vm.options.treshold);
        // console.log("contours = ", contours);
        vm.contours = Contours.findContours(cannyCanvas, 255, 0, 125);

        //vm.contours = getLongest(vm.contours);

        var centerPoint = Canvas.getCenter(vm.contours[0]);
        Canvas.drawPoint(cannyCtx, centerPoint);
        var path = Canvas.getPath(vm.contours[0], centerPoint);
        Canvas.canvasClear(pathCtx);
        Canvas.drawPath(pathCtx, path, 'blue', 1, vm.options.pathLength, vm.options.pathHeight, true);

        //console.log("path = ", path);
        // console.log("centerPoint = ", centerPoint);
        // console.log("vm.contours = ", vm.contours);
        drawContoursPaths();
      }

      function drawContoursPaths() {
        if (vm.contours.length > 0 && vm.options.to > vm.contours.length) {
          vm.options.to = vm.contours.length;
        }
        if (vm.options.from >= vm.options.to) {
          vm.options.from = vm.options.to - 1;
        }
        if (vm.options.from < 0) {
          vm.options.from = 0;
        }
        //cannyCtx.drawImage(canny.imageData, 0, 0);
        for (var i = vm.options.from; i < vm.options.to; i++) {
          Canvas.drawPath(cannyCtx, vm.contours[i], 'green', 3);
        }
      }

    }];
  });
})();
