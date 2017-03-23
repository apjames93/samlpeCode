'use strict';

angular
  .module('app')
  .controller('contactSalesController', contactSalesController);

/** @ngInject */
function contactSalesController($scope, $location,
                                recaptchaService) {

  $scope.gRecaptchaResponse = '';

  $scope.PotentialCustomer = function(customerData) {
    PotentialCustomer.create({
      'email': customerData.email,
      'phoneNumber': customerData.phoneNumber,
      'firstName': customerData.firstName,
      'lastName': customerData.lastName,
      'address': customerData.address,
      'subject': customerData.subject,
      'allowcontact': customerData.allowcontact
    });
  };

  $scope.sendEmail = function(customerData, recaptcha) {
    recaptchaService.recaptcha(recaptcha)
      .then(function(data) {
        if (data.data.success === false) {
          alert('double check that you are not a robot');
        }
        if (data.data.success === true) {
          $location.path('/welcome');
          $scope.PotentialCustomer(customerData);
          $scope.customerData.firstName = '';
          $scope.customerData.lastName = '';
          $scope.customerData.address = '';
          $scope.customerData.phoneNumber = '';
          $scope.customerData.email = '';
          $scope.customerData.subject = '';
          $scope.customerData.allowcontact = false;
        }
      });
  };
}
