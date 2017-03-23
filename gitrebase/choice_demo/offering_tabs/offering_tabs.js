'use strict';

angular
  .module('app')
  .directive('offeringsTabs', offeringsTabs);

/** @ngInject */
function offeringsTabs() {
  return {
    restrict: 'AE',
    templateUrl: 'app/directives/offerings_tabs/offerings_tabs.html',
    scope: {},
    controller: offeringsTabsController
  };
};

/** @ngInject */
function offeringsTabsController($scope, $http, $location) {

  //{
  //    "ip": "72.130.72.77",
  //    "countryCode": "US",
  //    "countryName": "United States",
  //    "regionCode": "HI",
  //    "regionName": "Hawaii",
  //    "city": "Kailua",
  //    "zipCode": "96734",
  //    "timeZone": "Pacific/Honolulu",
  //    "latitude": 21.4003,
  //    "longitude": -157.752,
  //    "metroCode": 744
  //}

  $scope.delegationAgreement = function() {
    $location.path('/black_hills_energy_delegation_agreement');
  };
  $http({
    method: 'GET',
    url: '/geo_locate'
  }).then(resp => {
    if (resp && resp.data) {
      $scope.geoLoc = resp.data;
      var index = 'CO AI KS NE SD WY'.split(' ')
        .indexOf(resp.data.regionCode);
      $scope.selectedIndex = index >= 0 ? index : 0;
      console.log('Selecting state index: ' + index);
    }
  }, err => $scope.geoError = err);

};
