define(['angular', 'restangular'], function(angular) {
  "use strict";
  var factory = function(API, $log, Restangular) {
    return Restangular.withConfig(function(RestangularConfigurer) {
      RestangularConfigurer
        .setBaseUrl(API.url)
        .setResponseExtractor(function(response) {
          if (typeof response.response !== 'undefined') {
            var newResponse = response.response;
            newResponse.meta = response.meta;
            newResponse.paging = response.paging;
            newResponse.error = response.error;
            return newResponse;
          }
          return response;
        })
        .setErrorInterceptor(function(response) {
          if (response.status === 401) {
            $log.error('unauthorized!');
          } else {
            $log.error('connection interrupted!');
          }
        });
    });
  };

  factory.$inject = ['API', '$log', 'Restangular'];
  return factory;
});
