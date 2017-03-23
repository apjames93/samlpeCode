'use strict';

angular
  .module('app')
  .controller('dealsController', dealsController);

/** @ngInject */
function dealsController($scope, DealDataService, RDeal, RCustomer) {

  $scope.dealData = new DealDataService();
  $scope.searchDealsOne = '';

  $scope.gridData = function() {
    $scope.gridOptionDeal.data = [];
    $scope.dealData.items.forEach(function(item) {
      const rowData = {
        "DealId": item.deal_id,
        "PipelineName": item.pipeline_name,
        "LocationName": item.locations_name,
        "CustomerId": item.customer_id,
        "CustomerName": item.customer_name,
        "TradeDate": item.trade_date,
        "BeginDate": item.beg_date,
        "EndDate": item.end_date,
        "Market": item.market
      }
      $scope.gridOptionDeal.data.push(rowData)
    });
  };
  $scope.gridOptionDeal = {
    columnDefs: [{
      name: 'DealId',
      cellTemplate: '<span  cl' +
      'ass = "table-link" ng-click="grid.appScope.dealInfo(row.entity,' +
      ' 0)">{{row.entity.DealId}}</span>'
    }, {name: 'PipelineName'}, {name: 'LocationName'}, {
      name: 'CustomerId',
      cellTemplate: '<span  cl' +
      'ass ="table-link" ng-click="grid.appScope.dealInfo(row.entity,' +
      ' 1)">{{row.entity.CustomerId}}</span>'
    }, {name: 'CustomerName'}, {name: 'TradeDate'}, {name: 'BeginDate'},
      {name: 'EndDate'}, {name: 'Market'}]

  };

  $scope.$watch("dealData.items.length", function(value) {
    if (value) {
      $scope.gridData()
    }
    if (value) {
      $scope.createRowData()
      $scope.gridOptions.refreshView()
    }
    if (value < 3) {
      if (value === 1 || 0) {
        $scope.dataLength = value;
        return $scope.dataLength;
      }
      $scope.dealData.nextPage();
    }
  });
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

  $scope.selectedTab = 0;
  $scope.goToTab = function(index) {
    $scope.selectedTab = index;
  };

  $scope.dealInfo = function(value, tabIndex) {
    $scope.thisDeal = value.DealId;
    $scope.thisCustomer = value.CustomerId;
    $scope.hideTable = true;
    $scope.hideDeal = true;
    $scope.goToTab(tabIndex);
  };

  $scope.showSearch = function() {
    $scope.hideTable = false;
    $scope.hideDeal = false;
    $scope.dealData.nextPage();
  };

  $scope.lookUpByDealId = function(value, index) {
    RDeal.get({id: value}).$promise.then(function(data) {
      if (data) {
        $scope.thisDeal = data.volume[0].id;
        $scope.thisCustomer = data.volume[0].customerId;
        $scope.hideTable = true;
        $scope.hideDeal = true;
        $scope.error1 = '';
        $scope.goToTab(index);
        $scope.dealId = '';
      }
    }).catch(function(error) {
      $scope.error1 =
        'looks like we dont have an account with that' + ' deal id';
    });
  };

  $scope.lookUpByCustomerId = function(value, index) {
    RCustomer.get({id: value}).$promise.then(function(data) {
      if (data) {
        $scope.thisDeal = data.customer[0].dealId;
        $scope.thisCustomer = data.customer[0].id;
        $scope.hideTable = true;
        $scope.hideDeal = true;
        $scope.error2 = '';
        $scope.goToTab(index);
        $scope.customerId = '';
      }
    }).catch(function(error) {
      $scope.error2 =
        'looks like we dont have an account with that' + ' customer id';
    })
  }

  var columnDefs = [{headerName: "Deal Id", field: "dealId"},
    {headerName: "Pipeline Name", field: "pipelineName"},
    {headerName: "Location Name", field: "locationName"},
    {headerName: "Customer Id", field: "customerId"},
    {headerName: "Customer Name", field: "customerName"},
    {headerName: "Trade Date", field: "tradeDate"},
    {headerName: "Begin Date", field: "beginDate"},
    {headerName: "End Date", field: "endDate"},
    {headerName: "Market", field: "market"}
    ];

  $scope.rowData = [];
  $scope.createRowData = function() {


    // for (var i = 0; i < 10000; i++) {
    //   $scope.rowData.push({
    //     dealId: i,
    //     pipelineName: i,
    //     locationName: Math.round(Math.random() * 100),
    //     customerId: Math.round(Math.random() * 100),
    //     customerName: i,
    //     tradeDate: i,
    //     beginDate: i,
    //     endDate: i,
    //     market: i
    //   });
    // }

    for (var i = 0; i < $scope.dealData.items.length; i++) {
      $scope.rowData.push({
        dealId: $scope.dealData.items[i].deal_id,
        pipelineName: $scope.dealData.items[i].pipeline_name,
        locationName:$scope.dealData.items[i].locations_name,
        customerId: $scope.dealData.items[i].customer_id,
        customerName: $scope.dealData.items[i].customer_name,
        tradeDate: $scope.dealData.items[i].trade_date,
        beginDate: $scope.dealData.items[i].beg_date,
        endDate: $scope.dealData.items[i].end_date,
        market: $scope.dealData.items[i].market
      });
    }

  console.log(  $scope.gridOptions)
    return $scope.rowData;
  }



  $scope.gridOptions = {
    columnDefs: columnDefs,
    rowData: $scope.createRowData()

  };

}
