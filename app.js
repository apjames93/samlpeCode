
/** @ngInject */
app.factory('DealData', function($http, RDeal) {
  var DealData = function() {
    this.items = [];
    this.id = [];
    this.busy = false;
    this.after = 0;
  };
  DealData.prototype.nextPage = function() {
    if (this.busy) {
      return;
    }
    this.busy = true;
    RDeal.query({'data': this.after}, function(data) {
      var items = data;
      for (var i = 0; i < items.length; i++) {
        this.items.push(items[i]);
      }

      this.after = this.after + 50;
      this.busy = false;

      if (items.data === 'thats all') {
        this.busy = true;
      }
    }.bind(this));
  };
  return DealData;
});



function(){
  var DealData = function() {
    this.items = [];
    this.id = [];
    this.busy = false;
    this.after = 0;
  };
  DealData.prototype.nextPage = function() {
    if (this.busy) {
      return;
    }
    this.busy = true;
    RDeal.query({'data': this.after}, function(data) {
      var items = data;
      for (var i = 0; i < items.length; i++) {
        this.items.push(items[i]);
      }

      this.after = this.after + 50;
      this.busy = false;

      if (items.data === 'thats all') {
        this.busy = true;
      }
    }.bind(this));
  };
  return DealData;
}
