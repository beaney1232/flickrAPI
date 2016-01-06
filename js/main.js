var myApp = angular.module("myApp", ["infinite-scroll"]);

myApp.controller("flickrController", function ($scope, flickr) {
  $scope.flickr = new flickr();
  $scope.searchTerm = "";

  $scope.$watch("searchTerm", function (newValue, oldValue) {
    console.log("hit");
    if (newValue == oldValue) {
      return;
    }
    $scope.flickr.populateTable($scope.searchTerm);
  });

  $scope.printstuff = function () {
    console.log($scope.searchTerm);
  }
});

myApp.factory('flickr', function ($http) {

  var flickr = function () {
    this.items = [];
    this.busy = false;
    this.after = "";
    this.tempItems = [];
    this.noResults = false;
  };

  flickr.prototype.populateTable = function (searchTerm) {
    document.getElementById("loaderBox").style.display = "block";
    document.getElementById("body").className = "noscroll";

    this.tempItems = [];
    if (searchTerm == "all" || searchTerm == "") {
      if (this.items.length > 0) {
        for (var i = 0; i < this.items.length; i++) {
          var newItem = this.items[i];
          var title = newItem.title.substring(0, 15);
          newItem.title = title;
          this.tempItems.push(newItem);
          this.busy = false;
          setTimeout(continueExecution, 800);
        }
      }
      return;
    }

    for (var i = 0; i < this.items.length; i++) {
      var newItem = this.items[i];
      var title = newItem.title.substring(0, 15);
      newItem.title = title;

      var searchTermTolower = searchTerm.toLowerCase();
      var titleToLower = searchTerm.toLowerCase();

      if (title.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1) {
        this.tempItems.push(newItem);
        this.busy = true;
        setTimeout(continueExecution, 800);
      }
    }

    if (this.tempItems.length == 0) {
      this.noResults = true;
      setTimeout(continueExecution, 800);
    } else {
      this.noResults = false;
      setTimeout(continueExecution, 800);
    }
  }

  flickr.prototype.nextPage = function (searchTerm) {
    console.log("starting");
    if (this.busy) return;
    this.busy = true;
    var url = "https://api.flickr.com/services/feeds/photos_public.gne?format=json&jsoncallback=JSON_CALLBACK";
    //var url2 = "https://api.flickr.com/services/feeds/photos_public.gne?format=json";
    $http.jsonp(url).success(function (data) {
      var items = data.items;

      var j = 0;
      if (searchTerm == null || searchTerm == "") {
        for (var i = 0; i < items.length; i++) {
          var newItem = items[i];
          var title = newItem.title.substring(0, 15);
          newItem.title = title;
          this.items.push(newItem);
          this.items.push(newItem);
        }
        this.tempItems = this.items;
        this.populateTable("all");
      }

      this.busy = false;
    }.bind(this));
  };

  return flickr;
});

function continueExecution() {
  document.getElementById("loaderBox").style.display = "none";
  document.getElementById("body").className = "";

}