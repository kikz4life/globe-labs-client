'use strict';

/* Directives */


angular.module('myApp.directives', ['LocalStorageModule'])
  .directive('appVersion', ['version', function(version) {
    return function(scope, elm, attrs) {
      elm.text(version);
    };
  }])
  .directive('donateBtn', function(localStorageService) {
    return {
      restrict : 'A',
      template : '<a href="http://developer.globelabs.com.ph/dialog/oauth?app_id=gBKdrHRyMMeCp5Tr7zcMnGC8kKqkHagB" class="btn btn-primary">Donate</a>',
      // template : '<a class="btn btn-primary">Donate</a>',
      link: function(scope, element, attrs) {
        // localStorageService.add("id", attrs.orgid);
        console.log(attrs);
        console.log('donateBtn');
      }
    }
  });
