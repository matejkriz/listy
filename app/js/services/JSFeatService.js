define([], function() {
  "use strict";
  var factory = function($log) {
    function getMatrix(columns, rows, dataType) {
      columns = columns | 630;
      rows = rows | 480;
      dataType = dataType | jsfeat.U8_t | jsfeat.C1_t;
      return new jsfeat.matrix_t(columns, rows, dataType);
    }
    return {
      getMatrix: getMatrix
    };
  };

  factory.$inject = ['$log'];
  return factory;
});
