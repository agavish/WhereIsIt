var controllers = angular.module('controllers', []);

controllers.controller('userController', ['$scope', '$rootScope', function($scope, $rootScope) {
  
  // no need to hold a $scope.user variable, we get the user from the session.currentUser which is stored on the $rootScope
  $rootScope.title = $rootScope.session.currentUser.firstname + " " + $rootScope.session.currentUser.lastname;
}]);

controllers.controller('businessController', ['$scope', '$rootScope', '$routeParams', 'businessService', 'reviewService', '$sce', '$location', 'googleMapsApiService', function($scope, $rootScope, $routeParams, businessService, reviewService, $sce, $location, googleMapsApiService) {
  $scope.businessId = $routeParams.businessId;
  $scope.business = '';

  $scope.dayDisplay = {
    1: "א",
    2: "ב",
    3: "ג",
    4: "ד",
    5: "ה",
    6: "ו",
    7: "ש'"
  }

  $scope.getBusinessById = function(businessId) {
    $rootScope.loading = true;
    businessService.getBusinessById(businessId)
    .success(function(data, status) {
        $scope.business = data;
        $rootScope.title = $scope.business.name;
        $rootScope.loading = false;
        return;
      }); 
  }

  $scope.createBusiness = function() {
    businessService.createBusiness($scope.business)
    .success(function(data, status) {
      $location.path('/business/' + $scope.business._id);
    });
  }

  $scope.updateBusiness = function() {
    businessService.updateBusinessById($scope.business)
    .success(function(data, status) {
      $location.path('/business/' + $scope.business._id);
    });
  }

  $scope.getBusinessCoordinatesByAddress = function() {
    googleMapsApiService.getCoordinatesByAddress($scope.business.address)
      .success(function(data,status) {
        var location = data.results[0].geometry.location;
        $scope.business.address.coordinates[0] = location.lng;
        $scope.business.address.coordinates[1] = location.lat;
      });
  }

 $scope.getReviewsByBusinessId = function(businessId) {
    $rootScope.loading = true;
    reviewService.getReviewsByBusinessId(businessId)
    .success(function(data, status) {
        $scope.business.reviews = data;
        $rootScope.loading = false;
        return;
      })
    .error(function(data, status) {
        $scope.business.reviews = [];
        $rootScope.loading = false;
        return;
      });
  }

  $scope.getGoogleMapsEmbedURL = function() {
    var url = "";
    if ($rootScope.position) {
      url += "https://www.google.com/maps/embed/v1/directions?";
      url += "key=AIzaSyDWApw_dyQHYl7KNAN-KbYNrQUgRgY83sk";
      url += "&origin=" + $rootScope.position.latitude + "," + $rootScope.position.longitude;
      url += "&destination=" + $scope.business.address.coordinates[1] + "," + $scope.business.address.coordinates[0];
      url += "&language=he";
    }
    return $sce.trustAsResourceUrl(url);
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
    $rootScope.loading = true;
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
    $rootScope.loading = true;
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