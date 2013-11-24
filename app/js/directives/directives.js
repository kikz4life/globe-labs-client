'use strict';

/* Directives */


angular.module('myApp.directives', ['LocalStorageModule'])
  .directive('appVersion', ['version', function(version) {
    return function(scope, elm, attrs) {
      elm.text(version);
    };
  }])
  .directive('calendar', function() {
    return {
      restrict: 'A',
      require: 'ngModel',
      link: function(scope,el,attr, ngModel) {
        if(!attr.calendar) {
          $(el).datepicker({
            // endDate : '-5y'
          });
        } 
        $(el).datepicker()
          .on('changeDate', function(e){
            scope.$apply(function() {
              ngModel.$setViewValue(e.date);
          });
        });
      }
    }
  })
  .directive('globalMessage', function() {
    return {
      restrict : 'A',
      template : '<div>' +
                    '<div class="alert alert-success">' +
                      '<button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>' +
                      '{{data}}' +
                    '</div>' +
                  '</div>',
      link: function(scope, element, attrs) {
        if(attrs.globalMessage == 'error') {
          element.find('.alert-success').addClass('alert-danger');
        }
      }
    }
  })
  .directive('loader', function() {
    return {
      restrict: 'A',
      template: '<div class="loading pull-right" ng-show="loading">' +
                  '<img src="img/ajax-loader.gif" class="animated rotateIn" />' +
                '</div>',
      link: function(scope, element, attrs) {
        console.log('loader');
      }
    }
  });
