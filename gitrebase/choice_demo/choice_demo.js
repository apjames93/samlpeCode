'use strict';

angular
  .module('app')
  .controller('choiceDemoController', choiceDemoController);

/** @ngInject */
function choiceDemoController($scope, SgCustomer) {

  $scope.pickTerm = function() {
    $scope.showTerm = $scope.customerData.value.billClass === 'RES';
  };

  $scope.selectedIndex = 0;
  $scope.errorMessage = true;
  $scope.letsGetStarted = false;
  $scope.stepTwo = true;
  $scope.stepThree = true;

  $scope.goToTabIndex = function(index) {
    $scope.selectedIndex = index;
    if (index === 3) {
      $scope.pickTerm();
      $scope.errorMessage = true;
      $scope.letsGetStarted = true;
      $scope.stepTwo = false;
    }
  };

  $scope.cantFindAccount = function(data) {
    if (data === false) {
      setTimeout(function() {
        $scope.errorMessage = false;
      }, 2000);
    }
  };

  $scope.lookupInfo = function() {
    $scope.sgCustomer = SgCustomer.findOne({
      filter: {
        where: {
          accountNum: $scope.accountNumber, premiseNumber: $scope.premiseNumber
        }
      }
    });
    $scope.customerData = $scope.sgCustomer.$promise.$$state;
    $scope.cantFindAccount($scope.sgCustomer.$resolved);
    $scope.sgCustomer.$promise.then(() => $scope.goToTabIndex(3));
  };

  $scope.radioValue = 1;

  $scope.note = function() {
    if ($scope.customerData.value.note === undefined) {
      $scope.customerData.value.note = 'nil';
    }
  };

  $scope.getDocument = function(customerTerm) {
    $scope.stepTwo = true;
    $scope.stepThree = false;
    $scope.note();
    if ($scope.documentId) {
      return $scope.selectedIndex = 4;
    }
    SgCustomer.generateChoicePdf({
      query: {
        where: {
          accountNum: $scope.customerData.value.accountNum,
          premiseNumber: $scope.customerData.value.premiseNumber
        },
        confirmNumber: null,
        accountNum: $scope.customerData.value.accountNum,
        premiseNum: $scope.customerData.value.premiseNumber,
        billClass: $scope.customerData.value.billClass,
        progYear: 2017,
        serviceState: $scope.customerData.value.serviceState,
        customer: {
          name: $scope.customerData.value.firstName + ' ' +
          $scope.customerData.value.lastName,
          serviceAddress: $scope.customerData.value.serviceAddress,
          serviceCsz: $scope.customerData.value.serviceCity +
          $scope.customerData.value.serviceState +
          $scope.customerData.value.serviceZip,
          mailingAddress: $scope.customerData.value.serviceAddress,
          mailingeCsz: $scope.customerData.value.serviceCity +
          $scope.customerData.value.serviceState +
          $scope.customerData.value.serviceZip,
          emailAddress: $scope.customerData.value.emailAddress,
          phone: $scope.customerData.value.telephone
        },
        progType: null,
        term: customerTerm,
        price: null,
        legal: null,
        note: $scope.customerData.value.note
      }
    }).$promise.then(response => {
      $scope.customerInfo = response.data;
      $scope.documentId = response.documentId;
      $scope.selectedIndex = 4;
    });
  };
}


// 
// add state
//  addState('choiceDemo' , false, '/black_hills_energy_delegation_agreement');
