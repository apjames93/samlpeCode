'use strict';

angular
  .module('app')
  .controller('dealsController', dealsController);

/** @ngInject */
function dealsController($scope, DealDataService, RDeal) {




  $scope.gridData = function(){
    $scope.gridOptions.data=[];
    $scope.dealData.items.forEach(function(item) {
      const rowData = {
        "DealId": item.deal_id,
        "PipelineName": item.pipeline_name,
        "LocationName":  item.locations_name,
        "CustomerId":  item.customer_id,
        "CustomerName":  item.customer_name,
        "TradeDate":  item.trade_date,
        "BeginDate":  item.beg_date,
        "EndDate":  item.end_date,
        "Market":  item.market
      }
      $scope.gridOptions.data.push(rowData)
    });
  };
  $scope.gridOptions = {
    enableFiltering: true,
    columnDefs: [{name: 'DealId' ,cellTemplate: '<span  cl' +
    'ass = "table-link" ng-click="grid.appScope.dealInfo(row.entity,' +
    ' 0)">{{row.entity.DealId}}</span>'
    }, {name: 'PipelineName'},
      {name: 'LocationName'},
      {name: 'Customer Id', cellTemplate: '<span  cl' +
  'ass ="table-link" ng-click="grid.appScope.dealInfo(row.entity,' +
  ' 1)">{{row.entity.CustomerId}}</span>'},
      {name: 'CustomerName'}, {name: 'TradeDate'},
      {name: 'BeginDate'}, {name: 'EndDate'},
      {name: 'Market'}
    ]
  };

  $scope.gridOptions.onRegisterApi = function(gridApi){
    $scope.gridApi = gridApi;
    console.log($scope.gridApi.grid.columns)
  };

  $scope.$watch('searchDealsOne', function(newValue) {
    if (newValue) {
      var str = newValue.toString();
      if (str.length < 1) {
        $scope.dealData.nextPage();
      }
      if ($scope.dataLength === 1 || 0) {
        $scope.dealData.nextPage(0);
      }
    }
  });

  $scope.$watch("dealData.items.length", function(value) {
    if(value){
      $scope.gridData()
    }
    if (value < 3) {
      if (value === 1 || 0) {
        $scope.dataLength = value;
        return $scope.dataLength;
      }
      $scope.dealData.nextPage();

    }
  });

  $scope.getOne = function(value){
    console.log(value)
    RDeal.get({id: value.dealId}).$promise.then(function(data){
      console.log(data)
      if(data){
        $scope.thisDeal = value.dealId;
        $scope.hideTable = true;
        $scope.hideDeal = false;
        $scope.error= '';
      }
    }).catch(function(error){
      $scope.error = 'looks like we dont have an account with that' +
        ' deal id';
    })
  }

  $scope.dealInfo = function(value, tabIndex) {
    console.log(value.DealId)
    $scope.thisDeal = value.DealId;
    $scope.thisCustomer = value.CustomerId;
    $scope.hideTable = true;
    $scope.hideDeal = false;
    $scope.goToTab(tabIndex);
  };

  $scope.searchDealsOne = '';
  $scope.searchDealsTwo = '';
  $scope.searchDealsThree = '';
  $scope.searchDealsFour = '';
  $scope.dealData = new DealDataService();
  $scope.hideTable = false;
  $scope.hideDeal = true;


  $scope.showSearch = function() {
    $scope.hideTable = false;
    $scope.hideDeal = true;
    $scope.dealData.nextPage();
  };

  $scope.selectedIndex = 0;
  $scope.goToTabIndex = function(index) {
    $scope.selectedIndex = index;
    $scope.dealData.nextPage();
  };

  $scope.goBackTabIndex = function(index) {
    $scope.selectedIndex = index;
    if (index === 0) {
      $scope.searchDealsTwo = '';
    }
    if (index === 1) {
      $scope.searchDealsThree = '';
      $scope.searchDealsFour = '';
    }
    if (index === 2) {
      $scope.searchDealsFour = '';
    }
    if (index === 3) {
      $scope.searchDealsThree = '';
    }
  };

  $scope.selectedTab = 0;
  $scope.goToTab = function(index) {
    $scope.selectedTab = index;
  };

}
