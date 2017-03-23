'use strict';

angular
  .module('app')
  .factory('DealDataService', DealDataService);
/** @ngInject */
function DealDataService(RDeal) {
  var DealData = function DealData() {
    this.items = [];
    this.busy = false;
    this.after = 0;
    this.message = 'Loading';
  };

  DealData.prototype.nextPage = function(info) {
    var infoIn = info;
    if (infoIn === 0) {
      if (this.after = 0) {
        return infoIn = 1;
      }
      this.after = 0;
      this.busy = false;
      this.message = 'Loading';
    }
    if (this.busy) {
      return;
    }
    this.busy = true;
    RDeal.query({
      filter: {
        'id': this.after
      }
    }, function(data) {
      var items = data;
      for (var i = 0; i < items.length; i++) {
        this.items.push(items[i]);
      }
      this.after = this.after + 300;
      this.busy = false;
      if (items.length === 0) {
        this.message = 'that is all of the data';
        this.busy = true;
        this.after = 0;
      }
    }.bind(this));
  };
  return DealData;
};
