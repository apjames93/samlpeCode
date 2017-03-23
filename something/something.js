'use strict';

angular
  .module('app')
  .controller('viewDocumentController', viewDocumentController);

/** @ngInject */
function viewDocumentController($rootScope, $scope, baseData, navigate, Document) {

  $scope.rootScope = $rootScope;
$scope.baseData = baseData;
$scope.navigate = navigate;

  let fuseSearch = null;

  $scope.$watch('filterSearch', s => $scope.filterList(s));

  Document.find({
    "filter": {
      "include": {
        "relation": "documentTemplate"
      }
    }
  }).$promise.then(data => {

    for (var i = 0; i < data.length; i++) {
      let time = moment(data[i].createdAt).format('DD/MM/YYYY');
      data[i].createdAt = time;
      if (data[i].finalized === true) {
        var str = data[i].name;
        var urlName = str.replace(/ /g, '%20');
        data[i].urlName = urlName;
      }
    }
    $scope.allData = data;
    // Create a Fuse Search
    fuseSearch = new Fuse(data, {
      caseSensitive: false,
      include: ['score', 'matches'],
      shouldSort: false,
      tokenize: false,
      threshold: 0.3,
      location: 0,
      distance: 10,
      maxPatternLength: 32,
      keys: ['Name', 'lastName', 'email', 'type']
    });
    $scope.filterList($scope.filterSearch);
  });

  $scope.filterList = function(search) {
    if (!$scope.data) {
      return;
    }
    if (!search || s.isBlank(search)) {
      $scope.filteredPeople =
        $scope.data.sort((a, b) => a.lastName.localeCompare(b.lastName));
    } else {
      let results = fuseSearch.search(search);
      //[ { groupname, matches, score, item } ], sort by score then last name
      results = results.sort((a, b) => a.score === b.score ?
        a.item.name.localeCompare(b.item.name) : a.score);
      $scope.filteredData = results.map(r => r.item);
    }
  };
}



































  var fuseSearch = null;

  $scope.$watch('filterSearch', v => $scope.search(v));

  Document.find({
    'filter': {
      'include': [

        'documentTemplate']
    }
  }).$promise.then(documents => {
    $scope.allData = documents;
    documents.forEach(document => {
      document.createdAt = moment(documents.createdAt).format('MM/DD/YYYY');
      document.urlName = encodeURIComponent(document.name);
    });
    fuseSearch = new Fuse(documents, {
      caseSensitive: false,
      include: ['score', 'matches'],
      tokenize: true,
      keys: ['name', 'documentTemplate.name', 'createdAt', 'account',
        'values.premiseNum']
    });
    $scope.$watch('filterSearch', v => $scope.search(v));
  });

  $scope.search = function(value) {
    if (!search || s.isBlank(search)) {
      // Set results as all data if the query is blank
      $scope.searchResults = $scope.allData;
    } else {
      $scope.searchResults = fuseSearch.search(value).map(r => r.item);
    }
  };
