'use strict';

/* Directives */


angular.module('myApp.directives', [])
  .directive('appVersion', ['version', function(version) {
    return function(scope, elm, attrs) {
      elm.text(version);
    };
  }])
  .directive('donateBtn', function() {
    return {
      restrict : 'A',
      template : '<a href="http://developer.globelabs.com.ph/dialog/oauth?app_id=gBKdrHRyMMeCp5Tr7zcMnGC8kKqkHagB" class="btn btn-primary">Donate</a>',
      link: function(scope, element, attrs) {
        console.log('donateBtn');
      }
    }
  });
