(function() {
  'use strict';
  define(['Hammer'], function(Hammer) {
    var factory = function(Canvas) {

      //TODO: bind events only after doubleclick

      function init(ctx, img, width, height) {
        // get a reference to an element
        var stage = document.getElementById('previewCanvas');

        // create a manager for that element
        var manager = new Hammer.Manager(stage);

        // create recognizers
        var Pan = new Hammer.Pan({
          event: 'pan',
          pointer: 1,
          threshold: 30,
          time: 10
        });
        var Rotate = new Hammer.Rotate();
        var Pinch = new Hammer.Pinch();

        // use them together
        Rotate.recognizeWith([Pinch, Pan]);
        Pinch.recognizeWith([Rotate, Pan]);

        // add the recognizers
        manager.add(Pan);
        manager.add(Rotate);
        manager.add(Pinch);

        // subscribe to events
        var liveScale = 1;
        var prevRotation = 0;
        var firstEvent = true;
        manager.on('rotatemove', function(e) {
            var rotation = Math.round(liveScale * e.rotation);
            if (firstEvent) {
              prevRotation = rotation;
              firstEvent = false;
            }
            Canvas.canvasClear(ctx);
            ctx.translate(width / 2, width / 2);
            ctx.rotate((rotation - prevRotation) * Math.PI / 180);
            ctx.translate(-width / 2, -width / 2);
            ctx.drawImage(img, 0, 0, width, height);
            prevRotation = rotation;
        });
        manager.on('rotateend', function(e) {
          firstEvent = true;
        });


        manager.on('panmove', function(e) {
          e.preventDefault();
          if (img.width > width || img.height > height) {
            Canvas.canvasClear(ctx);
            ctx.translate(e.deltaX / 40, e.deltaY / 40);
            ctx.drawImage(img, 0, 0, width, height);
          }
        });

        // subscribe to events
        var currentScale = 1;

        function getRelativeScale(scale) {
          return currentScale + (scale - 1) * 0.01;
        }
        manager.on('pinchmove', function(e) {
          var scale = getRelativeScale(e.scale);
          Canvas.canvasClear(ctx);
          ctx.scale(scale, scale);
          ctx.drawImage(img, 0, 0, width, height);
        });
        manager.on('pinchend', function(e) {
          // cache the scale
          currentScale = getRelativeScale(e.scale);
          liveScale = currentScale;
        });
      }

      return {
        init: init
      };
    };

    factory.$inject = ['Canvas'];
    return factory;
  });
})();
