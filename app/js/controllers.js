define([
  'angular'
], function(
  angular
) {
  angular.module('listy.controllers', [])

  .controller('DashCtrl', ['$scope', 'Camera', 'Canvas', 'api', 'Feat', 'FileReader', 'Contours', 'CV', function($scope, Camera, Canvas, api, Feat, FileReader, Contours, CV) {
    //Contours.closeContour();
    //CV.findContours();
    $scope.reprocessCanny = reprocessCanny;
    $scope.drawContoursPaths = drawContoursPaths;

    $scope.options = {
      blurRadius: 8,
      blurRadius2: 8,
      from: 0,
      to: 10,
      pathLength: 1600,
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
    var width;
    var height;
    var imgPreview;
    var canny;
    drawImages('img/test.jpg', 'previewCanvas');

    function drawImages(image, canvasID) {
      previewCtx = Canvas.getContext(canvasID);
      Canvas.canvasClear(previewCtx);

      var img = new Image();
      img.onload = function() {
        width = img.width;
        height = img.height;
        imgPreview = img;
        previewCtx.drawImage(imgPreview, 0, 0);

        var imageData = previewCtx.getImageData(0, 0, width, height);
        //drawBW(imageData, width, height, 'bwCanvas');
        canny = drawCanny(imageData, width, height, 'cannyCanvas');

        drawContours(canny);

      };
      img.src = image;
    }

    function getLongest(arrayOfArrays){
      var indexOfLongest = 0;
      for (var i = 0; i < arrayOfArrays.length; i++) {
        if(arrayOfArrays[indexOfLongest].length < arrayOfArrays[i].length){
          indexOfLongest = i;
        }
      }
      return [arrayOfArrays[indexOfLongest]];
    }

    function drawBW(imageData, width, height, canvasID) {
      var imgU8 = Feat.getMatrix(width, height);
      var ctx = Canvas.getContext(canvasID);

      var imgResult = Feat.grayScale(imageData, width, height, imgU8);

      Canvas.renderImageData(imgResult.imageData, imgResult.imgU8, ctx);
      return imgResult;
    }
    var cannyCtx;
    function drawCanny(imageData, width, height, canvasID) {
      var imgU8 = Feat.getMatrix(width, height);
      var ctx = Canvas.getContext(canvasID);
      Canvas.canvasClear(ctx);
      cannyCtx = ctx;
      var options = {
        lowThreshold: 10,
        highThreshold: 100,
        blurRadius: $scope.options.blurRadius,
        blurRadius2: $scope.options.blurRadius2
      };

      var imgResult = Feat.canny(imageData, width, height, imgU8, options);

      Canvas.renderImageData(imgResult.imageData, imgResult.imgU8, ctx);
      return imgResult;
    }

    function reprocessCanny() {
      var imageData = previewCtx.getImageData(0, 0, width, height);
      canny = drawCanny(imageData, width, height, 'cannyCanvas');
      drawContours(canny);
    }

    function drawContours(canny) {
      var ctCtx = Canvas.getContext('cannyCanvas');
      var pathCtx = Canvas.getContext('pathCanvas');
      Canvas.canvasClear(ctCtx);
      Canvas.canvasClear(pathCtx);
      Canvas.renderImageData(canny.imageData, canny.imgU8, ctCtx);
      var cannyCanvas = document.getElementById('cannyCanvas');
      var contours = Contours.findContours(cannyCanvas, 100, 0, $scope.options.treshold);
      // console.log("contours = ", contours);
      $scope.contours = Contours.findContours(cannyCanvas, 255, 0, 125);

      //$scope.contours = getLongest($scope.contours);

      var centerPoint = Canvas.getCenter($scope.contours[0]);
      Canvas.drawPoint(cannyCtx, centerPoint);
      var path = Canvas.getPath($scope.contours[0], centerPoint, 400)
      Canvas.canvasClear(pathCtx)
      Canvas.drawPath(pathCtx, path, 'blue', $scope.options.pathLength, true);

      //console.log("path = ", path);
      // console.log("centerPoint = ", centerPoint);
      // console.log("$scope.contours = ", $scope.contours);
      drawContoursPaths();
    }

    function drawContoursPaths(){
      if($scope.contours.length > 0 && $scope.options.to > $scope.contours.length){
        $scope.options.to = $scope.contours.length;
      }
      if($scope.options.from >= $scope.options.to) {
        $scope.options.from = $scope.options.to - 1;
      }
      if($scope.options.from < 0){
        $scope.options.from = 0;
      }
      //cannyCtx.drawImage(canny.imageData, 0, 0);
      for (var i = $scope.options.from; i < $scope.options.to ; i++) {
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
