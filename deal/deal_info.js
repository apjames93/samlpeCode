'use strict';

angular
  .module('app')
  .directive('dealInfo', dealInfo);

/** @ngInject */
function dealInfo() {
  return {
    restrict: 'AE',
    templateUrl: 'app/directives/deal_info/deal_info.html',
    scope: {
      data: '='
    },
    controller: dealInfoController
  };
};

/** @ngInject */
function dealInfoController($scope, RDeal) {

  $scope.$watch('data', function(value) {
    if (value) {
      $scope.dealInfo(value);
    }
  });

  $scope.dealInfo = function(id) {
    RDeal.get({
      id: id
    }, function(response) {
      $scope.volume = response.volume;
      $scope.dealDetails = response.deal_details
      console.log($scope.volume)
      console.log()
    });
  };

}
for (var i = 0; i < array.length; i++) {
  array[i]
}
