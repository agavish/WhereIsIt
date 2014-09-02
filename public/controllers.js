var controllers = angular.module('controllers', []);

controllers.controller('userController', ['$scope', 'userService', function($scope, userService) {
  
  $scope.userProfile = '';

  $scope.getUserById = function() {
    userService.getUserById()
    .success(function(data, status) {
        $scope.userProfile = data;
      });  
  }
  $scope.getUserById();
}]);

controllers.controller('businessController', ['$scope', '$routeParams', 'businessService', function($scope, $routeParams, businessService) {
  $scope.businessId = $routeParams.businessId;
  $scope.business = '';
  $scope.getBusinessById = function(businessId) {
    businessService.getBusinessById(businessId)
    .success(function(data, status) {
        $scope.business = data;
      });  
  }
  $scope.getBusinessById($scope.businessId);
}]);

controllers.controller("searchController", ['$scope', '$rootScope', '$routeParams', 'businessService', function($scope, $rootScope, $routeParams, businessService) {
  $scope.keyword = $routeParams.keyword;
  $scope.searchBusinessesByKeyword = function (keyword, postion) {
    businessService.getBusinessesByKeyword(keyword, postion)
      .success(function(data, status) {
        $rootScope.businesses = data;
        $rootScope.title = 'תוצאות עבור: ' + keyword;
        $rootScope.loading = false;
      })
      .error(function(data, status) {
        $rootScope.businesses = [];
        $rootScope.title = 'לא נמצאו תוצאות עבור: ' + keyword;
        $rootScope.loading = false;
      });
  }

  $scope.searchBusinessesByKeyword($scope.keyword, $rootScope.position);
}]);

controllers.controller("searchBarController", ['$scope', '$rootScope', '$location',  function($scope, $rootScope, $location) {
  $scope.search = function(keyword) {
    $rootScope.loading = true;
    $location.path('/search/' + keyword);
  };
}]);

controllers.controller("mainController", ['$scope', '$rootScope', function($scope, $rootScope) {
  $rootScope.position = {
    latitude: "0",
    longitude: "0",
    accuracy: "0"
  }

  $rootScope.error = "";
  $rootScope.loading = false;
  $rootScope.title = "";
  $rootScope.businesses = [];

  $rootScope.hasBusinesses = function () {
    return $rootScope.businesses.length > 0;
  }
  $scope.isGeolocationSupported = function () {
    return $rootScope.error == "";
  }
  $scope.setPosition = function (position) {
    $rootScope.position.latitude = position.coords.latitude;
    $rootScope.position.longitude = position.coords.longitude;
    $rootScope.position.accuracy = position.coords.accuracy;
    $rootScope.$apply();
    // $scope.loading = true;
    // $scope.getNearestBusinesses();
  }
  $scope.initLocation = function () {
    if (navigator.geolocation) {
      var options = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      };
      navigator.geolocation.getCurrentPosition($scope.setPosition, null, options);
    }
    else {
      $rootScope.error = "Geolocation is not supported by this browser.";
    }
  }
  $scope.initLocation();
}]);