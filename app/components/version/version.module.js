'use strict';

var version = require('./version.component'),
    interpolate = require('./version.filter');

angular.module('myApp.version', [])
    .value('version', '0.1')
    .filter('interpolate', interpolate)
    .component('appVersion', version);    

