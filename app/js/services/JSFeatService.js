define([], function() {
  "use strict";
  var factory = function($log) {
    function getMatrix(columns, rows, dataType) {
      dataType = dataType | jsfeat.U8_t | jsfeat.C1_t;
      return new jsfeat.matrix_t(columns, rows, dataType);
    }

    function grayScale(imageData, width, height, imgU8, code) {
      code = code || jsfeat.COLOR_RGBA2GRAY;
      jsfeat.imgproc.grayscale(imageData.data, width, height, imgU8, code);
      return {
        imageData: imageData,
        imgU8: imgU8
      };
    }

    function canny(imageData, width, height, imgU8, options) {
      var r = options.blurRadius | 0;
      var kernelSize = (r + 1) << 1;
      jsfeat.imgproc.grayscale(imageData.data, width, height, imgU8);
      jsfeat.imgproc.gaussian_blur(imgU8, imgU8, kernelSize, 0);
      jsfeat.imgproc.canny(imgU8, imgU8, options.lowThreshold, options.highThreshold);
      return {
        imageData: imageData,
        imgU8: imgU8
      };
    }
    return {
      getMatrix: getMatrix,
      grayScale: grayScale,
      canny: canny
    };
  };

  factory.$inject = ['$log'];
  return factory;
});
