'use strict';

(function(orig) {
    angular.modules = [];
    angular.module = function() {
        if (arguments.length > 1) {
            angular.modules.push(arguments[0]);
        }
        return orig.apply(null, arguments);
    }
})(angular.module);

require('./vendor/css/normalize.css');
require('./vendor/css/main.css');
require('./app.css');
require('./components/version/version.module');
require('./view1/view1');
require('./view2/view2');

// Declare app level module which depends on views, and components
angular.module('myApp', [
  'ngRoute',
  'myApp.view1',
  'myApp.view2',
  'myApp.version'
]).
config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
  $locationProvider.hashPrefix('!');

  $routeProvider.otherwise({redirectTo: '/view1'});
}]);
