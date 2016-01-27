define(['angular'], function(angular) {
  "use strict";

  var filter = function($sce) {
    return function(url) {
      return $sce.trustAsResourceUrl(url);
    };
  };

  filter.$inject = ['$sce'];
  return filter;
});
