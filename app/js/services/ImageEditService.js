(function() {
  'use strict';
  define(['Hammer'], function(Hammer) {
    var factory = function(Canvas) {
      var ctx;
      var img;
      var manager;
      var width, height;


      function turnOff() {
        manager.off('rotatemove', rotateMove);
        manager.off('rotateend', rotateEnd);
        manager.off('panmove', panMove);
        manager.off('pinchmove', pinchMove);
        manager.off('pinchend', pinchEnd);
      }

      function turnOn() {
        // subscribe to events
        manager.on('rotatemove', rotateMove);
        manager.on('rotateend', rotateEnd);
        manager.on('panmove', panMove);
        manager.on('pinchmove', pinchMove);
        manager.on('pinchend', pinchEnd);
      }

      function init(context, image, w, h) {
        ctx = context;
        img = image;
        width = w;
        height = h;
        // get a reference to an element
        var stage = document.getElementById('previewCanvas');

        // create a manager for that element
        manager = new Hammer.Manager(stage);

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
      }

      function panMove(e) {
        if (img.width > width || img.height > height) {
          Canvas.canvasClear(ctx);
          ctx.translate(e.deltaX / 40, e.deltaY / 40);
          ctx.drawImage(img, 0, 0, width, height);
        }
      }

      function pinchEnd(e) {
        // cache the scale
        currentScale = getRelativeScale(e.scale);
        liveScale = currentScale;
      }

      var currentScale = 1;

      function getRelativeScale(scale) {
        return currentScale + (scale - 1) * 0.01;
      }

      function pinchMove(e) {
        var scale = getRelativeScale(e.scale);
        Canvas.canvasClear(ctx);
        ctx.scale(scale, scale);
        ctx.drawImage(img, 0, 0, width, height);
      }

      function rotateEnd(e) {
        firstEvent = true;
      }

      var liveScale = 1;
      var prevRotation = 0;
      var firstEvent = true;

      function rotateMove(e) {
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
      }

      return {
        init: init,
        turnOn: turnOn,
        turnOff: turnOff
      };
    };

    factory.$inject = ['Canvas'];
    return factory;
  });
})();
