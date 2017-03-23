'use strict';

angular
  .module('app')
  .controller('reportsController', reportsController);

/** @ngInject */
function reportsController($rootScope, $scope, baseData, navigate,
                           RCurrentRisk) {

  $scope.rootScope = $rootScope;
  $scope.baseData = baseData;
  $scope.navigate = navigate;
  $scope.filterName = "";

  $scope.gridOptions.data;
  $scope.gridOptions = {
    columnDefs: [
      { field: 'name' },
      { field: 'amount', name: 'Number', cellFilter: 'fractionFilter' },
      { field: 'amount', name: 'Currency', cellFilter: 'currencyFilter:this' }
    ]
  };


  $scope.findPipeData = function(value){
    $scope.filterName = value
  }



  $scope.loadData = function() {
    RCurrentRisk.get().$promise.then(function(data) {

      $scope.total = _.groupBy(data.total, "pipeline");
      console.log('total====', $scope.total)

      $scope.gridOptions.data = [{test: 'test'}]

      for (let i = 0; i < data.riskMonths.length; i++) {
        data.riskMonths[i].year = moment(data.riskMonths[i].month).format('YYYY');
        data.riskMonths[i].month = moment(data.riskMonths[i].month).format('MM');
      }

      $scope.groups = _.groupBy(data.riskMonths, function(value){
        return value.pipeline + '_' + value.year + '_' + value.risk_type;
      });
      console.log($scope.groups)

    })
  }


}

for (var i = 0; i < array.length; i++) {
  array[i]
}
'angular-ui-grid': [
  'ui-grid.ttf',
  'ui-grid.woff',
  'ui-grid.eot',
  'ui-grid.svg'
],



$scope.filterName = "none";

$scope.showTabDialog = function() {
  $mdDialog.show({
    templateUrl: 'riskData.tmpl.html',
    clickOutsideToClose: true,
    controller: tabController,
    locals: {
      thisDeal: $scope.thisDeal
    }
  });
  /** @ngInject */
  function tabController($scope, thisDeal) {
    $scope.thisDeal = thisDeal;
    $scope.cancel = function() {
      $mdDialog.hide();
    };
  }
};

$scope.showInfo = function(value) {
  $scope.showTabDialog()
  console.log(value.entity)
};
