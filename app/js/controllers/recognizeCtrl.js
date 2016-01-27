(function() {
  'use strict';
  define(['Hammer'], function(Hammer) {
    return [
      'api',
      'Camera',
      'Canvas',
      'Contours',
      'Feat',
      'FileReader',
      'ImageEdit',
      '$ionicLoading',
      '$ionicPopup',
      '$ionicModal',
      '$scope',
      '$state',
      '$timeout',
      'TreeService',
      '$window',
      function(
        api,
        Camera,
        Canvas,
        Contours,
        Feat,
        FileReader,
        ImageEdit,
        $ionicLoading,
        $ionicPopup,
        $ionicModal,
        $scope,
        $state,
        $timeout,
        TreeService,
        $window) {
        var vm = this;

        vm.hasContours = false;
        vm.padding = 15;
        vm.windowWidth = $window.innerWidth;
        var size = Math.floor(vm.windowWidth / 2 - vm.padding);
        vm.canvas = {
          width: size,
          height: 15
        };

        vm.options = {
          blurRadius: 5,
          blurRadius2: 2,
          from: 0,
          to: 1,
          pathLength: Math.floor(vm.windowWidth - 3 * vm.padding),
          pathHeight: Math.floor(vm.windowWidth / 1.618),
          treshold: 10
        };

        vm.tree = {
          name: '',
          nameLatin: '',
          link: '',
          imgLink: '',
          descriptors: []
        };

        var img;
        var imgData;
        var cannyCtx;
        var descriptor;
        var path;
        var previewCtx;
        var height;
        var width;

        vm.canSave = canSave;
        vm.drawContourPath = drawContourPath;
        vm.findTree = findTree;
        vm.getFile = getFile;
        vm.reprocessCanny = reprocessCanny;
        vm.saveTree = saveTree;
        vm.showForm = showForm;
        vm.hideForm = hideForm;
        vm.takePicture = takePicture;
        vm.toggleEdit = toggleEdit;
        vm.toggleEraser = toggleEraser;

        //drawImages('img/test.jpg', 'previewCanvas');

        function canSave() {
          return vm.hasContours;
        }

        function findTree() {
          reprocessCanny(500);
          $ionicLoading.show();
          vm.tree.descriptors = [{
            note: '',
            descriptor: descriptor
          }];
          TreeService.find(vm.tree)
            .then(function(res) {
              $state.go('^.treeDetail', {
                treeId: res._id
              })
            })
            .catch(function(err) {
              showError(err);
            })
            .finally(function(){
              $ionicLoading.hide();
            });
        }

        function getFile(file) {
          FileReader.readAsDataUrl(file, $scope)
            .then(function(resultFile) {
              drawImages(resultFile, 'previewCanvas');
            });
        }

        function drawImages(image, canvasID) {
          previewCtx = Canvas.getContext(canvasID);
          Canvas.canvasClear(previewCtx);
          // FIXME: get id from params
          cannyCtx = Canvas.getContext('cannyCanvas');

          img = new Image();

          img.onload = function() {

            width = vm.canvas.width;
            vm.canvas.height = Math.floor(vm.canvas.width * (img.height / img.width));
            height = vm.canvas.height;
            previewCtx.canvas.height = height;
            if (cannyCtx) {
              cannyCtx.canvas.height = height;
              Canvas.canvasClear(cannyCtx);
            }
            ImageEdit.init(previewCtx, img, width, height);
            Canvas.initEraser(canvasID);


            previewCtx.drawImage(img, 0, 0, width, height);
            imgData = previewCtx.getImageData(0, 0, width, height);

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
          return arrayOfArrays[indexOfLongest];
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
          vm.contours = [];
          vm.hasContours = false;
          $timeout.cancel(timeout);
          timeout = $timeout(function() {
            previewCtx.putImageData(imgData, 0, 0);
            var imageData = previewCtx.getImageData(0, 0, width, height);
            var canny = drawCanny(imageData, width, height, 'cannyCanvas');
            drawContours(canny);
          }, delay || 500, false);

        }

        function drawContours(canny) {
          var pathCtx = Canvas.getContext('pathCanvas');
          Canvas.canvasClear(pathCtx);

          var cannyCanvas = document.getElementById('cannyCanvas');
          var contours = Contours.findContours(cannyCanvas, 100, 0, vm.options.treshold);
          // console.log("contours = ", contours);
          vm.contours = Contours.findContours(cannyCanvas, 255, 0, 125);
          vm.contour = getLongest(vm.contours);

          vm.hasContours = vm.contour && vm.contour.length > 0;

          if (vm.hasContours) {
            vm.contour = Contours.startBottom(vm.contour);

            var centerPoint = Canvas.getCenter(vm.contour);
            Canvas.drawPoint(cannyCtx, centerPoint);
            path = Canvas.getPath(vm.contour, centerPoint);
            Canvas.canvasClear(pathCtx);
            Canvas.drawPath(
              pathCtx,
              path,
              'blue',
              1,
              vm.options.pathLength,
              vm.options.pathHeight,
              true
            );

            descriptor = TreeService.getDescriptor(path);

            drawContourPath();
          }
        }

        function drawContourPath() {
          Canvas.drawPath(cannyCtx, vm.contour, 'green', 3);
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
          for (var i = vm.options.from; i < vm.options.to; i++) {
            Canvas.drawPath(cannyCtx, vm.contours[i], 'green', 3);
          }
        }

        var enableEdit = false;

        function toggleEdit() {
          if (!enableEdit) {
            ImageEdit.turnOn();
          } else {
            ImageEdit.turnOff();
            reprocessCanny(0);
          }
          enableEdit = !enableEdit;
        }

        vm.enableEraser = false;

        function toggleEraser() {
          reprocessCanny(0);
          vm.enableEraser = !vm.enableEraser;
          Canvas.setErasing(vm.enableEraser);
          // TODO: enable to not save changes
          imgData = previewCtx.getImageData(0, 0, width, height);
        }

        function takePicture() {
          Camera.takePicture().then(function(picture) {
            setTimeout(function() {
              drawImages(picture, 'previewCanvas');
            }, 0);
          });
        }

        $ionicModal.fromTemplateUrl('templates/addTreeForm.html', {
          scope: $scope,
          animation: 'slide-in-up'
        }).then(function(modal) {
          vm.modal = modal;
        });

        function showForm() {
          vm.modal.show();
          vm.tree.descriptors = [{
            note: '',
            descriptor: descriptor
          }];
          var pathModalCtx = Canvas.getContext('pathCanvasModal');
          Canvas.canvasClear(pathModalCtx);
          setTimeout(function() {
            Canvas.drawPath(
              pathModalCtx,
              descriptor,
              'blue',
              1,
              vm.modal.modalEl.clientWidth - vm.padding,
              vm.options.pathHeight,
              false,
              true
            );
          }, 0);

        };

        function showError(err) {
          var alertPopup = $ionicPopup.alert({
            title: 'Chyba ukládání:',
            template: err
          });
        };

        function showSucessful() {
          var alertPopup = $ionicPopup.alert({
            title: 'Uloženo',
            template: 'Nový strom byl v pořádku uložen.'
          });

          alertPopup.then(function() {
            hideForm();
          });
        };

        function saveTree() {
          TreeService.add(vm.tree)
            .then(function(id) {
              showSucessful();
            })
            .catch(function(err) {
              showError(err);
            });
        }

        function hideForm() {
          vm.modal.hide();
        };

        $scope.$on('$destroy', function() {
          vm.modal.remove();
        });

      }
    ];
  });
})();
