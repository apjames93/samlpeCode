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
      console.log( $scope.createRowData())
    if (value) {
      $scope.gridData()
    }
    // if (value) {
    //   $scope.gridinfo()
    // }
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
    })
  }

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


  var columnDefs = [
    {headerName: "Deal Id", field: "dealId"},
    {headerName: "Pipeline Name", field: "pipelineName"},
    {headerName: "Location Name", field: "locationName"},
    {headerName: "Customer Id", field: "customerId"},
    {headerName: "Customer Name", field: "customerName"},
    {headerName: "Trade Date", field: "tradeDate"},
    {headerName: "Begin Date", field: "beginDate"},
    {headerName: "End Date", field: "endDate"},
    {headerName: "Market", field: "market"}
  ];

  // $scope.rowData = [];
  // $scope.gridinfo = function() {
  //   var rowData = [];
  //   $scope.dealData.items.forEach(function(item) {
  //     const rowinfo = {
  //       "dealId": item.deal_id,
  //       "pipelineName": item.pipeline_name,
  //       "locationName": item.locations_name,
  //       "customerId": item.customer_id,
  //       "customerName": item.customer_name,
  //       "tradeDate": item.trade_date,
  //       "beginDate": item.beg_date,
  //       "endDate": item.end_date,
  //       "market": item.market
  //     }
  //       $scope.rowData.push(rowinfo)
  //   });
  //   return $scope.rowData;
  // };
  $scope.createRowData = function() {
    var rowData = [];

    $scope.dealData.items.forEach(function(item) {
      rowData.push({
        "dealId": item.deal_id,
        "pipelineName": item.pipeline_name,
        "locationName": item.locations_name,
        "customerId": item.customer_id,
        "customerName": item.customer_name,
        "tradeDate": item.trade_date,
        "beginDate": item.beg_date,
        "endDate": item.end_date,
        "market": item.market
      });
    })

    return rowData;
  }




  $scope.gridOptions = {
    columnDefs: columnDefs,
    rowData: $scope.createRowData()
  };


}
//
//  $scope.createRowData = function() {
//   var rowData = [];
//
//    $scope.dealData.items.forEach(function(item) {
//     rowData.push({
//       "dealId": item.deal_id,
//       "pipelineName": item.pipeline_name,
//       "locationName": item.locations_name,
//       "customerId": item.customer_id,
//       "customerName": item.customer_name,
//       "tradeDate": item.trade_date,
//       "beginDate": item.beg_date,
//       "endDate": item.end_date,
//       "market": item.market
//     });
//   }
//
//   return rowData;
// }
//
