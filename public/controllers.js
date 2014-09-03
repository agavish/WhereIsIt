var controllers = angular.module('controllers', []);

controllers.controller('userController', ['$scope', '$rootScope', 'userService', function($scope, $rootScope, userService) {
  
  // no need to hold a $scope.user variable, we get the user from the session.currentUser which is stored on the $rootScope
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
  $scope.results = [];

  $scope.hasResults = function () {
    return $scope.results.length > 0;
  }

  $scope.searchBusinessesByKeyword = function (keyword, postion) {
    businessService.getBusinessesByKeyword(keyword, postion)
      .success(function(data, status) {
        $scope.results = data;
        $rootScope.title = 'תוצאות עבור: ' + keyword;
        $rootScope.loading = false;
        return;
      })
      .error(function(data, status) {
        $scope.results = [];
        $rootScope.title = 'לא נמצאו תוצאות עבור: ' + keyword;
        $rootScope.loading = false;
        return;
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