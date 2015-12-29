angular.module('listy.controllers', [])

.controller('DashCtrl', function($scope, CameraService) {
  $scope.takePicture = function(){
      CameraService.takePicture();
  };
})

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
