'use strict';

angular.module('myApp.view1', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view1', {
    template: require('./view1.html'),
    controller: 'View1Ctrl'
  });
}])

.controller('View1Ctrl', [function() {
    var controller = this;

    controller.doSomething = function() {
        console.log('doSomething...');
    }

    controller.clickIcon = function() {
        console.log('clickedIcon...');
    }


}])

.controller('View1Ctrl03', [function() {

}]);

