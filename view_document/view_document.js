'use strict';

angular
  .module('app')
  .controller('viewDocumentController', viewDocumentController);

/** @ngInject */
function viewDocumentController($rootScope, $scope, baseData, navigate,
                                Document) {

  $scope.rootScope = $rootScope;
  $scope.baseData = baseData;
  $scope.navigate = navigate;
  $scope.filterSearch = "";
  $scope.filterSearchTwo = "";
  $scope.hide = true;
  $scope.finalized = true

  Document.find({
    "filter": {
      "include": {
        "relation": "documentTemplate"
      }
    }
  }).$promise.then(documents => {
    documents.forEach(document => {
      document.createdAt = moment(documents.createdAt).format('MM/DD/YYYY');
      document.urlName = encodeURIComponent(document.name);
    });
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
}



 addState('viewDocument', true, '/view_document', true);
