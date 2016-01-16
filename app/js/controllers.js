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
    $scope.options = {
      blurRadius: 5
    };

    $scope.getFile = function(file) {
      FileReader.readAsDataUrl(file, $scope)
        .then(function(result) {
          $scope.imageSrc = result;
          console.log("result = ", result);
          drawImages(result, 'previewCanvas');
        });
    };

    $scope.takePicture = function() {
      console.log('takePicture!');
      Camera.takePicture().then(function(neco) {
        setTimeout(function() {
          console.log('neco = ', neco);
        }, 0);
      });
    };

    var previewCtx;
    var width;
    var height;
    drawImages('img/test.jpg', 'previewCanvas');
    function drawImages(image, canvasID) {
      previewCtx = Canvas.getContext(canvasID);

      var img = new Image();
      img.onload = function() {
        width = img.width;
        height = img.height;
        previewCtx.drawImage(img, 0, 0);

        var imageData = previewCtx.getImageData(0, 0, width, height);
        //drawBW(imageData, width, height, 'bwCanvas');
        drawCanny(imageData, width, height, 'cannyCanvas');

      };
      img.src = image;
    }

    function drawBW(imageData, width, height, canvasID) {
      var imgU8 = Feat.getMatrix(width, height);
      var ctx = Canvas.getContext(canvasID);

      var imgResult = Feat.grayScale(imageData, width, height, imgU8);

      Canvas.renderImageData(imgResult.imageData, imgResult.imgU8, ctx);
      return imgResult;
    }

    function drawCanny(imageData, width, height, canvasID) {
      var imgU8 = Feat.getMatrix(width, height);
      var ctx = Canvas.getContext(canvasID);
      var options = {
        lowThreshold: 10,
        highThreshold: 100,
        blurRadius: $scope.options.blurRadius
      };

      var imgResult = Feat.canny(imageData, width, height, imgU8, options);

      Canvas.renderImageData(imgResult.imageData, imgResult.imgU8, ctx);
      return imgResult;
    }

    function reprocessCanny(){
      var imageData = previewCtx.getImageData(0, 0, width, height);
      drawCanny(imageData, width, height, 'cannyCanvas');
    }

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
