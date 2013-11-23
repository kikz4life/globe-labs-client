'use strict';

/* Controllers */

angular.module('myApp.controllers', []).
  controller('LoginCtrl', ['$scope', function($scope) {
  	console.log('loaded loginCtrl');
  	$scope.test = 'Test';
  }]);