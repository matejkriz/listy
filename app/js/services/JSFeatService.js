define([], function() {
  "use strict";
  var factory = function($log) {
    function getMatrix(columns, rows, dataType) {
      columns = columns | 640;
      rows = rows | 480;
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
    return {
      getMatrix: getMatrix,
      grayScale: grayScale
    };
  };

  factory.$inject = ['$log'];
  return factory;
});
