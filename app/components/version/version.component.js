'use strict';

module.exports = function() {
    return {
        controller: function(version) {
            let controller = this;
            controller.$postLink = function($scope, $element) {
                $element.text(version);
            }
        }
    }
};