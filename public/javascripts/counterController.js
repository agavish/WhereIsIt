/**
 * Created by avi on 8/8/2014.
 */

app.controller("counterController", function ($scope) {
   $scope.counter = 0;

   $scope.increaseByOne = function () {
        $scope.counter++;
   }

   $scope.decreaseByOne = function () {
        $scope.counter--;
   }
});