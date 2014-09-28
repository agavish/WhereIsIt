var controllers = angular.module('controllers', []);

controllers.controller('userController', ['$scope', '$rootScope', 'userService', function($scope, $rootScope, userService) {

    // no need to hold a $scope.user variable, we get the user from the session.currentUser which is stored on the $rootScope
    $rootScope.title = $rootScope.session.currentUser.firstname + " " + $rootScope.session.currentUser.lastname;
    $scope.lastVisitedBusinesses = [];
    $scope.favoriteBusinesses = [];

    $scope.getLastVisitedBusinessesByUserId = function(userId) {
      $rootScope.loading = true;
      userService.getLastVisitedBusinessesByUserId(userId)
        .success(function(data, status) {
          $scope.lastVisitedBusinesses = data;
          $rootScope.loading = false;
          return;
        })
        .error(function(data, status) {
          $scope.lastVisitedBusinesses = [];
          $rootScope.loading = false;
          return;
        });
    }

    $scope.getFavoriteBusinessesByUserId = function(userId) {
      $rootScope.loading = true;
      userService.getFavoriteBusinessesByUserId(userId)
        .success(function(data, status) {
          $scope.favoriteBusinesses = data;
          $rootScope.loading = false;
          return;
        })
        .error(function(data, status) {
          $scope.favoriteBusinesses = [];
          $rootScope.loading = false;
          return;
        });
    }

    var userId = $rootScope.session.currentUser._id;
    $scope.getLastVisitedBusinessesByUserId(userId);
    $scope.getFavoriteBusinessesByUserId(userId);
  }
]);

controllers.controller('businessController', ['$scope', '$rootScope', '$routeParams', 'businessService', 'reviewService', '$sce', '$location', 'googleMapsApiService', function($scope, $rootScope, $routeParams, businessService, reviewService, $sce, $location, googleMapsApiService) {
  $scope.businessId = $routeParams.businessId;
  $scope.business = {};
  $scope.googlePlace;
  $scope.displayAddress = "";
  $scope.displayOpenHours = {
    1: { opened: true, displayDay: "ראשון", startHour: "09:00", endHour: "19:00"},
    2: { opened: true, displayDay: "שני", startHour: "09:00", endHour: "19:00"},
    3: { opened: true, displayDay: "שלישי", startHour: "09:00", endHour: "19:00"},
    4: { opened: true, displayDay: "רביעי", startHour: "09:00", endHour: "19:00"},
    5: { opened: true, displayDay: "חמישי", startHour: "09:00", endHour: "19:00"},
    6: { opened: true, displayDay: "שישי", startHour: "09:00", endHour: "19:00"},
    7: { opened: true, displayDay: "שבת", startHour: "09:00", endHour: "19:00"}
  };

  $scope.displayDay={1:"א",2:"ב",3:"ג",4:"ד",5:"ה",6:"ו",7:"ש"};
  $scope.businessTypes=["אוניברסיטה","אצטדיון","באולינג","בית חולים","בית מרקחת","בית משפט","בית ספר","בית קולנוע","בית קפה","בנק","בריאות","גלריה לאומנות","גן/פארק","דואר","חדר כושר","חנות","חנות אופניים","חנות אלכוהול","חנות אלקטרוניקה","חנות בגדים","חנות כלבו","חנות לבית","חנות לחומרי בניין","חנות לחיות מחמד","חנות נוחות","חנות נעליים","חנות ספרים","חנות פרחים","חנות רהיטים","חנות תכשיטים","חנייה","חשמלאים","כספומט","לינה ואירוח","מאפייה","מועדון לילה","מזון","מכבסה","מנעולנים","מסעדה","משטרה","משלוחי אוכל","סוחר רכב","סוכנות ביטוח","סוכנות נדלן","סוכנות נסיעות","סופרמרקט","סלון יופי","ספרייה","עורכי דין","פאב","פיזיותרפיסט","פיננסים","צבעים","קבלן","קמפינג","קניון/מרכז מסחרי","רואה חשבון","רופא","רופא שיניים","שטיפת מכוניות","שרברב","תחנת דלק","תחנת מוניות","תחנת רכבת","תיקון מכוניות/מוסך"];
  $scope.hours=["00:00","00:30","01:00","01:30","02:00","02:30","03:00","03:30","04:00","04:30","05:00","05:30","06:00","06:30","07:00","07:30","08:00","08:30","09:00","09:30","10:00","10:30","11:00","11:30","12:00","12:30","13:00","13:30","14:00","14:30","15:00","15:30","16:00","16:30","17:00","17:30","18:00","18:30","19:00","19:30","20:00","20:30","21:00","21:30","22:00","22:30","23:00","23:30"];

  $scope.getBusinessById = function(businessId) {
    $rootScope.loading = true;
    businessService.getBusinessById(businessId)
    .success(function(data, status) {
        $scope.business = data;
        $rootScope.title = $scope.business.name;
        $scope.setDisplayAddress();
        $scope.setDisplayOpenHours();
        $rootScope.loading = false;
        $scope.getReviewsByBusinessId(businessId);
        return;
      }); 
  }

  $scope.createBusiness = function() {
    $scope.setOpenHours();
    businessService.createBusiness($scope.business)
    .success(function(data, status) {
      $location.path('/business/' + data._id);
    });
  }

  $scope.createEmptyBusiness = function() {
    $scope.business = {
      name: "",
      businessType: "",
      address : {
        homeNumber: "",
        street: "",
        city: "",
        coordinates: []
      },
      phone: "",
      website: "",
      openHours: [],
      description: ""
    }
    $rootScope.title = "הוסף עסק חדש";
  }

  $scope.updateBusiness = function() {
    $scope.setOpenHours();
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
        return;
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

  $scope.$watch('displayAddress', function() {
      if ($scope.googlePlace) {
        var place = $scope.googlePlace.getPlace();
        if (place) {
          $scope.fillInAddress(place);
        }
      }
   });

  $scope.fillInAddress = function(place) {
    // get home number
    var streetNumberComponent = $scope.getAddressComponentByType(place, "street_number");
    $scope.business.address.homeNumber = streetNumberComponent.short_name;
    // get street
    var routeComponent = $scope.getAddressComponentByType(place, "route");
    $scope.business.address.street = routeComponent.long_name;
    // get city
    var localityComponent = $scope.getAddressComponentByType(place, "locality");
    $scope.business.address.city = localityComponent.long_name;
    // get coordinates
    var location = place.geometry.location;
    $scope.business.address.coordinates[0] = location.B;
    $scope.business.address.coordinates[1] = location.k;
    // update display address
    $scope.displayAddress = $scope.business.address.street + " " + $scope.business.address.homeNumber + " " + $scope.business.address.city; 
  }

  $scope.getAddressComponentByType = function(place, type) {
    for (var i=0; i<place.address_components.length; i++) {
      var currType = place.address_components[i].types[0];
      if (currType == type) {
        return place.address_components[i];
      }
    }
  }

  $scope.setDisplayAddress = function() {
    $scope.displayAddress = $scope.business.address.street ? $scope.business.address.street : "";
    $scope.displayAddress += $scope.business.address.homeNumber ? " " + $scope.business.address.homeNumber : "";
    $scope.displayAddress += $scope.business.address.city ? " " + $scope.business.address.city : "";
  }

  $scope.setDisplayOpenHours = function() {
    // initialize all days to closed
    for (day in $scope.displayOpenHours) {
      $scope.displayOpenHours[day].opened = false;
    }
    // get openHours information from business model
    var openHours = $scope.business.openHours;
    for (var i=0; i<openHours.length; i++) {
      var day = openHours[i].day;
      if (day) {
        $scope.displayOpenHours[day].opened = true;
        $scope.displayOpenHours[day].startHour = openHours[i].startHour;
        $scope.displayOpenHours[day].endHour = openHours[i].endHour;
      }
      $scope.$apply();
    }
  }

  $scope.setOpenHours = function() {
    $scope.business.openHours = [];
    for (var i=1; i <= Object.keys($scope.displayOpenHours).length ;i++) {
      var day = $scope.displayOpenHours[i];
      if (day.opened) {
        var dayOpenHours = {
          day: i,
          startHour: day.startHour,
          endHour: day.endHour
        }
        $scope.business.openHours.push(dayOpenHours);
      }
    }
  }

  var currentPath = $location.path();
  if (currentPath === '/business/' + $scope.businessId || 
      currentPath === '/business/' + $scope.businessId + '/update') {
    $scope.getBusinessById($scope.businessId);
  } else if (currentPath === '/business/create/new') {
    $scope.createEmptyBusiness();
  }
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
