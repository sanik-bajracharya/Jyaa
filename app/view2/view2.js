'use strict';

require('./view2.css');
angular.module('myApp.view2', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view2', {
    template: require('./view2.html'),
    controller: 'View2Ctrl'
  });
}])

.controller('View2Ctrl', [function() {
  
}]);
