var copy = require('copy');

console.log('Hello package js loaded...');
(function() {
    var vendorJSFilesToCopy = [
            './node_modules/angular/angular.js',
            './node_modules/angular-route/angular-route.js',
            './node_modules/html5-boilerplate/dist/js/vendor/modernizr-2.8.3.min.js',
        ],
        vendorCSSFilesToCopy = [
            './node_modules/html5-boilerplate/dist/css/normalize.css',
            './node_modules/html5-boilerplate/dist/css/main.css'
        ];

    copy.each(vendorJSFilesToCopy, './app/vendor/js', {flatten: true}, function(err, files) {
        if (err) throw err;
        // `files` is an array of the files that were copied 
    });
    copy.each(vendorCSSFilesToCopy, './app/vendor/css', {flatten: true}, function(err, files) {
        if (err) throw err;
        // `files` is an array of the files that were copied 
    });
})();

