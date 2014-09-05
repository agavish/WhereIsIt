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

controllers.controller("searchController", ['$scope', '$rootScope', '$routeParams', '$location', 'businessService', function($scope, $rootScope, $routeParams, $location, businessService) {
  $scope.keyword = null;
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

  $scope.searchNearestBusinesses = function (postion) {
    businessService.getNearestBusinesses(postion)
      .success(function(data, status) {
        $scope.results = data;
        $rootScope.title = 'עסקים במרחק של עד 1 ק"מ';
        $rootScope.loading = false;
        return;
      })
      .error(function(data, status) {
        $scope.results = [];
        $rootScope.title = 'לא נמצאו עסקים במרחק של עד 1 ק"מ';
        $rootScope.loading = false;
        return;
      });
  }

  if ($routeParams.keyword) {
    $scope.keyword = $routeParams.keyword;
    $scope.searchBusinessesByKeyword($scope.keyword, $rootScope.position);
  } else if ($location.path().indexOf("nearest") > -1) {
    $scope.searchNearestBusinesses($rootScope.position);
  }
  
}]);

controllers.controller("searchByKeywordBarController", ['$scope', '$rootScope', '$location',  function($scope, $rootScope, $location) {
  $scope.delegateSearchByKeyword = function(keyword) {
    $rootScope.loading = true;
    $location.path('/search/keyword/' + keyword);
  };
}]);

controllers.controller("searchNearestController", ['$scope', '$rootScope', '$location',  function($scope, $rootScope, $location) {
  $scope.delegateSearchNearest = function() {
    $rootScope.loading = true;
    $location.path('/search/nearest');
  };
}]);