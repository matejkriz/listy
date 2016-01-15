define([], function() {
  "use strict";
  var factory = function($log) {
    function getContext(canvasID) {
      var canvas = document.getElementById(canvasID);
      return canvas.getContext('2d');
    }

    function renderImageData(imageData, imgU8, context2D){
      // render result back to canvas
      var dataU32 = new Uint32Array(imageData.data.buffer);
      var alpha = (0xff << 24);
      var i = imgU8.cols * imgU8.rows,
        pix = 0;
      while (--i >= 0) {
        pix = imgU8.data[i];
        dataU32[i] = alpha | (pix << 16) | (pix << 8) | pix;
      }

      context2D.putImageData(imageData, 0, 0);
    }

    return {
      getContext: getContext,
      renderImageData: renderImageData
    };
  };

  factory.$inject = ['$log'];
  return factory;
});
