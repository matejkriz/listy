define([
  'angular'
], function(
  angular
) {
  angular.module('listy.controllers', [])

  .controller('DashCtrl', ['$scope', 'Camera', 'Canvas', 'api', 'Feat', 'FileReader', 'Contours', 'CV', '$window', function($scope, Camera, Canvas, api, Feat, FileReader, Contours, CV, $window) {
    //Contours.closeContour();
    //CV.findContours();
    $scope.padding = 15;
    $scope.reprocessCanny = reprocessCanny;
    $scope.drawContoursPaths = drawContoursPaths;
    $scope.windowWidth = $window.innerWidth;
    setCanvasSize($scope.windowWidth);

    function setCanvasSize(windowWidth) {
      var size = Math.floor(windowWidth / 2 - $scope.padding);
      $scope.canvas = {
        width: size,
        height: size
      };
    }


    // listen window width changes
    //
    // var w = angular.element($window);
    // $scope.$watch(function() {
    //   return $window.innerWidth;
    // }, function(value) {
    //   $scope.windowWidth = value;
    //   setCanvasSize(value);
    // });
    // w.bind('resize', function() {
    //   $scope.$apply();
    // })

    $scope.options = {
      blurRadius: 8,
      blurRadius2: 8,
      from: 0,
      to: 10,
      pathLength: Math.floor($scope.windowWidth - $scope.padding),
      pathHeight: Math.floor($scope.windowWidth / 1.618),
      treshold: 10
    };

    $scope.getFile = function(file) {
      FileReader.readAsDataUrl(file, $scope)
        .then(function(result) {
          $scope.imageSrc = result;
          // console.log("result = ", result);
          drawImages(result, 'previewCanvas');
        });
    };

    $scope.takePicture = function() {
      // console.log('takePicture!');
      Camera.takePicture().then(function(neco) {
        setTimeout(function() {
          // console.log('neco = ', neco);
        }, 0);
      });
    };

    var previewCtx;
    var cannyCtx;
    var width;
    var height;
    drawImages('img/test.jpg', 'previewCanvas');

    function drawImages(image, canvasID) {
      previewCtx = Canvas.getContext(canvasID);
      Canvas.canvasClear(previewCtx);

      var img = new Image();

      img.onload = function() {
        width = $scope.canvas.width;
        $scope.canvas.height = Math.floor($scope.canvas.width * (img.height / img.width));
        height = $scope.canvas.height;
        previewCtx.canvas.height = height;
        if(!!cannyCtx) {
          console.log("resize canny");
          cannyCtx.canvas.height = height;
          Canvas.canvasClear(cannyCtx);
        }

        previewCtx.drawImage(img, 0, 0, width, height);

        reprocessCanny();
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
        blurRadius: $scope.options.blurRadius,
        blurRadius2: $scope.options.blurRadius2
      };

      var imgResult = Feat.canny(imageData, width, height, imgU8, options);

      Canvas.renderImageData(imgResult.imageData, imgResult.imgU8, cannyCtx);
      return imgResult;
    }

    function reprocessCanny() {
      // FIXME: new image disappearing after reprocess
      var imageData = previewCtx.getImageData(0, 0, width, height);
      var canny = drawCanny(imageData, width, height, 'cannyCanvas');
      drawContours(canny);
    }

    function drawContours(canny) {
      var pathCtx = Canvas.getContext('pathCanvas');
      Canvas.canvasClear(pathCtx);

      var cannyCanvas = document.getElementById('cannyCanvas');
      var contours = Contours.findContours(cannyCanvas, 100, 0, $scope.options.treshold);
      // console.log("contours = ", contours);
      $scope.contours = Contours.findContours(cannyCanvas, 255, 0, 125);

      //$scope.contours = getLongest($scope.contours);

      var centerPoint = Canvas.getCenter($scope.contours[0]);
      Canvas.drawPoint(cannyCtx, centerPoint);
      var path = Canvas.getPath($scope.contours[0], centerPoint, $scope.options.pathHeight)
      Canvas.canvasClear(pathCtx)
      Canvas.drawPath(pathCtx, path, 'blue', $scope.options.pathLength, true);

      //console.log("path = ", path);
      // console.log("centerPoint = ", centerPoint);
      // console.log("$scope.contours = ", $scope.contours);
      drawContoursPaths();
    }

    function drawContoursPaths() {
      if ($scope.contours.length > 0 && $scope.options.to > $scope.contours.length) {
        $scope.options.to = $scope.contours.length;
      }
      if ($scope.options.from >= $scope.options.to) {
        $scope.options.from = $scope.options.to - 1;
      }
      if ($scope.options.from < 0) {
        $scope.options.from = 0;
      }
      //cannyCtx.drawImage(canny.imageData, 0, 0);
      for (var i = $scope.options.from; i < $scope.options.to; i++) {
        Canvas.drawPath(cannyCtx, $scope.contours[i]);
      }
    };

  }])

  .controller('ChatsCtrl', function($scope, TreeService) {
    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //
    //$scope.$on('$ionicView.enter', function(e) {
    //});

    $scope.chats = TreeService.all();
    $scope.remove = function(chat) {
      TreeService.remove(chat);
    };
  })

  .controller('ChatDetailCtrl', function($scope, $stateParams, TreeService) {
    $scope.chat = TreeService.get($stateParams.chatId);
  })

  .controller('AccountCtrl', function($scope) {
    $scope.settings = {
      enableFriends: true
    };
  });
});
