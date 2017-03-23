'use strict';

angular
  .module('app')
  .service('recaptchaService', recaptchaService);
/** @ngInject */
function recaptchaService($http, $q,  baseUrl) {
  this.recaptcha = function recaptcha(recaptchaResponse) {
    var deferred = $q.defer();
    $http({
      method: 'POST', params: {
        recaptchaResponse: recaptchaResponse,
      }, url: baseUrl.baseUrl + '/api/recaptcha'
    })
      .then(response => {
        deferred.resolve(response);
      }, err => {
        deferred.reject(err);
      });

    return deferred.promise;
  };
}
