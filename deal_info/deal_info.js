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
}

/** @ngInject */
function dealInfoController($scope, RDeal) {

  $scope.$watch('data', function(value) {
    if (value) {
      $scope.dealInfo(value);
    }
  });

  $scope.gridOptions = {
    enableFiltering: true,
    columnDefs: [{name: 'BeginDate'}, {name: 'ActualVolume'},
      {name: 'ContractVolume'}, {name: 'TriggerVolume'},
      {name: 'RiskType'}, {name: 'PipelineName'}
      ]
  };
  $scope.gridOptions.data = [];
  $scope.dealInfo = function(id) {
    RDeal.get({
      id: id
    }, function(response) {
      console.log(response.volume)
      $scope.billTo = response.billTo;
      $scope.serviceAddress = response.serviceAddress;
      $scope.contact = response.contact;
      $scope.indexData = response.index;
      for (let i = 0; i <  response.volume.length; i++) {
        const rowData = {
          "BeginDate": response.volume[i].begDate,
          "ActualVolume": response.volume[i].actual_volume,
          "ContractVolume": response.volume[i].contract_volume,
          "TriggerVolume": response.volume[i].trigger_volume,
          "RiskType": response.volume[i].risk_types,
          "PipelineName": response.volume[i].pipeline_name,
        };
        $scope.gridOptions.data.push(rowData);
      }
    });
  };
}






RDeal.query({
  filter: {
    'lookUp': value.lookUp,
    'string': value.string
  }
}).$promise.then(documents => {

  const fuseSearch = new Fuse(documents, {
    caseSensitive: false,
    include: ['score', 'matches'],
    tokenize: true,
    keys: ['name', 'documentTemplate.name', 'createdAt', 'values.account',
      'values.premiseNum']
  });
  $scope.search = function(value) {
    fuseSearch.search(value).map(r => r.item);
  }
  $scope.$watch('filterSearch', function(newValue) {
    $scope.searchResults = fuseSearch.search(newValue).map(r => r.item);
    console.log($scope.searchResults);
    console.log('new',newValue.length)
    if (newValue.length < 3) {
      $scope.hide = false;
    }  if (newValue.length === 0) {
      $scope.hide = true;
      $scope.filterSearchTwo = "";
    }
  });
});
