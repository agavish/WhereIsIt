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

  if ($location.path().indexOf("/keyword/") > -1 && $routeParams.keyword) {
    $scope.keyword = $routeParams.keyword;
    $scope.searchBusinessesByKeyword($scope.keyword, $rootScope.position);
  } else if ($location.path().indexOf("/nearest") > -1) {
    $scope.searchNearestBusinesses($rootScope.position);
  }
  
}]);

controllers.controller("searchByKeywordBarController", ['$scope', '$rootScope', '$location',  function($scope, $rootScope, $location) {
  $scope.delegateSearchByKeyword = function(keyword) {
    $rootScope.loading = true;
    var currentPath = $location.path();
    // bypass angular's route provider limitation:
    // by default, the route provider will be invoked only when the URL changes.
    // if a user is already at /search/nearest, and he clicks the button again,
    // the route provider will not be invoked again, and there won't be another query.
    // this addition tells angular that a successfull URL change has occured, and so it will invoke 
    // the route provider again.
    if (currentPath === '/search/keyword/' + keyword) {
      $scope.$emit("$routeChangeSuccess");  
    } else {
      $location.path('/search/keyword/' + keyword);
    }
  };
}]);

controllers.controller("searchNearestController", ['$scope', '$rootScope', '$location',  function($scope, $rootScope, $location) {
  $scope.delegateSearchNearest = function() {
    $rootScope.loading = true;
    var currentPath = $location.path();
    // bypass angular's route provider limitation:
    // by default, the route provider will be invoked only when the URL changes.
    // if a user is already at /search/nearest, and he clicks the button again,
    // the route provider will not be invoked again, and there won't be another query.
    // this addition tells angular that a successfull URL change has occured, and so it will invoke 
    // the route provider again.
    if (currentPath === '/search/nearest') {
      $scope.$emit("$routeChangeSuccess");  
    } else {
      $location.path('/search/nearest');
    }
  };
}]);