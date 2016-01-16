define([
  'angular'
], function(
  angular
) {
angular.module('listy.controllers', [])

.controller('DashCtrl', ['$scope', 'Camera', 'Canvas', 'api', 'Feat', 'FileReader', 'Contours', 'CV', function($scope, Camera, Canvas, api, Feat, FileReader, Contours, CV) {
  //Contours.closeContour();
  //CV.findContours();
  $scope.getFile = function(file) {
    FileReader.readAsDataUrl(file, $scope)
      .then(function(result) {
        $scope.imageSrc = result;
        drawImage(result, 'previewCanvas', 480, 480);
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

  function drawImage(image, canvasID, width, height) {
    var ctx = Canvas.getContext(canvasID);

    var img = new Image();
    img.onload = function() {
      width = img.width;
      height = img.height;
      ctx.drawImage(img, 0, 0);

      var imageData = ctx.getImageData(0, 0, width, height);
      drawBW(imageData, width, height, 'bwCanvas');

    };
    img.src = image;
  }

  function drawBW(imageData, width, height, canvasID) {
    var imgU8 = Feat.getMatrix(width, height);
    var ctx = Canvas.getContext(canvasID);

    var imgBW = Feat.grayScale(imageData, width, height, imgU8);

    Canvas.renderImageData(imgBW.imageData, imgBW.imgU8, ctx);
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
