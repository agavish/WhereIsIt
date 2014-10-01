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
                $rootScope.isLoggedIn = false;
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
                $rootScope.isLoggedIn = true;
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
        createBusiness: function(business) {
            return $http({ method: 'POST', url: '/api/business/' , data: business });
        },
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
        },
        updateBusinessById: function(business) {
            return $http({ method: 'PUT', url: '/api/business/' + business._id  , data: business });
        },
        addToFavorites: function (user,businessId) {
            return $http({})
        }
    };
}]);

services.factory('userService', ['$http', function($http) {
    return {
        getUserById: function(id) {
            return $http({ method: 'GET', url: '/api/users/' + id });
        },
        getLastVisitedBusinessesByUserId: function(id) {
            return $http({ method: 'GET', url: '/api/users/last-visited-businesses/' + id });
        },
        getFavoriteBusinessesByUserId: function (id) {
            return $http({ method: 'GET', url: '/api/users/favorite-businesses/' + id });
        }
    };
}]);

services.factory('googleMapsApiService', ['$http', function($http) {

    return {
        getCoordinatesByAddress: function(address) {
            var addressString = address.city + ' ' + address.street + ' ' + address.homeNumber;
            return $http({ method: 'GET', url: 'http://maps.google.com/maps/api/geocode/json?address=' + addressString + '&language=he' });
        }
    };
}]);

services.factory('reviewService', ['$http', function($http) {
    return {
        getReviewsByBusinessId: function(businessId) {
            return $http({ method: 'GET', url: '/api/review/business/' + businessId });
        }
    };
}]);

services.factory('geoLocationService', ['$rootScope', function($rootScope) {
    return {
        setPosition: function (position) {
            var myPosition = {};
            myPosition.latitude = position.coords.latitude;
            myPosition.longitude = position.coords.longitude;
            myPosition.accuracy = position.coords.accuracy;
            $rootScope.position = myPosition;
            $rootScope.$apply();
        },
        getPosition: function () {
            if (navigator.geolocation) {
                var options = {
                    enableHighAccuracy: true,
                    timeout: 5000,
                    maximumAge: 0
                };
                return navigator.geolocation.getCurrentPosition(this.setPosition, null, options);
            } else {
                return null;
            }
        }
    };
}]);