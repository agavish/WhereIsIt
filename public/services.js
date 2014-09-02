var services = angular.module('services', []);

services.factory('sessionService', ['$rootScope', '$window', '$http',
  function ($rootScope, $window, $http) {
  var session = {
    init: function () {
      this.resetSession();
    },
    resetSession: function() {
      this.currentUser = null;
      this.isLoggedIn = false;
    },
    facebookLogin: function() {
      var url = '/auth/facebook',
          width = 1000,
          height = 650,
          top = (window.outerHeight - height) / 2,
          left = (window.outerWidth - width) / 2;
      $window.open(url, 'facebook_login', 'width=' + width + ',height=' + height + ',scrollbars=0,top=' + top + ',left=' + left);
    },
    logout: function() {
      var scope = this;
      $http.delete('/auth').success(function() {
        scope.resetSession();
        $rootScope.$emit('session-changed');
      });
    },
    authSuccess: function(userData) {
      this.currentUser = userData;
      this.isLoggedIn = true;
      $rootScope.$emit('session-changed');
    },
    authFailed: function() {
      this.resetSession();
      alert('Authentication failed');
    }
  };
  session.init();
  return session;
}]);


services.factory('businessService', ['$http', function($http) {
  return {
    getBusinessesByKeyword: function(keyword, position) {
      var latitude = '';
      var longitude = '';
      var coordinates = '';
      if (position) {
        latitude = position.latitude;
        longitude = position.longitude;
        coordinates = longitude + ',' + latitude;
      }
      
      return $http({ method: 'GET', url: '/api/business/keyword/' + keyword + (coordinates ? '?coordinates=' + coordinates : '') });
    },
    getNearestBusinesses: function(position) {
      var latitude = position.latitude;
      var longitude = position.longitude;
      var coordinates = longitude + ',' + latitude;
      return $http({ method: 'GET', url: '/api/business/nearest/' + coordinates  });
    },
    getBusinessById: function(businessId) {
      return $http({ method: 'GET', url: '/api/business/' + businessId  });
    }
  };
}]);

services.factory('userService', ['$http', function($http) {
  return {
    getUserById: function(id) {
      return $http({ method: 'GET', url: '/api/users/' + id });
    }
  };
}]);