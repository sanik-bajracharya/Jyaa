var copy = require('copy');

(function() {
    var vendorJSFilesToCopy = [
            './node_modules/html5-boilerplate/dist/js/vendor/modernizr-2.8.3.min.js',
        ],
        vendorCSSFilesToCopy = [
            './node_modules/html5-boilerplate/dist/css/normalize.css',
            './node_modules/html5-boilerplate/dist/css/main.css'
        ];
    
    var copyStaticResources = function(source, target, options) {
        copy.each(source, target, options, function(err, files) {
            if (err) throw err;
        });
    };

    copyStaticResources(vendorJSFilesToCopy, './app/vendor/js', {flatten: true});
    copyStaticResources(vendorCSSFilesToCopy, './app/vendor/css', {flatten: true});    
})();

