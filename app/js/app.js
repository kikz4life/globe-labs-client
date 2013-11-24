'use strict';


// Declare app level module which depends on filters, and services
angular.module('myApp', [
  'ngRoute',
  'myApp.filters',
  'myApp.services',
  'myApp.servicesApi',
  'myApp.directives',
  'myApp.controllers',
  'ezfb'
])
.config(['$routeProvider', function($routeProvider) {
  // $routeProvider.when('/view1', {templateUrl: 'partials/partial1.html', controller: 'MyCtrl1'});
  // $routeProvider.when('/home', {templateUrl: 'partials/home.html', controller: 'HomeCtrl'});
  $routeProvider.when('/login', {templateUrl: 'partials/login.html', controller: 'LoginCtrl'});
  // org pages
  $routeProvider.when('/redirect_uri', {templateUrl: 'partials/redirect_page.html', controller: 'CallbackCtrl'});
  $routeProvider.when('/home', {templateUrl: 'partials/organizations.html', controller: 'OrganizationCtrl'});
  $routeProvider.when('/donations', {templateUrl: 'partials/donations.html', controller: ''});
  $routeProvider.when('/organizations/detail/:orgId', {templateUrl: 'partials/details.html'});
  $routeProvider.when('/settings', {templateUrl: 'partials/user_setting_list.html', controller: 'SettingCtrl'});
  $routeProvider.when('/settings/add', {templateUrl: 'partials/user_setting.html', controller: 'SettingCtrl'});

  $routeProvider.otherwise({redirectTo: '/home'});
}])
.config(function ($FBProvider) {
	$FBProvider.setInitParams({
	  appId: 252759961441661
	});
})
/**
 * $http interceptor.
 * On 401 response - it stores the request and broadcasts 'event:loginRequired'.
 */
.config(function($httpProvider) {
  var interceptor = function($rootScope, $q, $window) {
    var ctr = 1;

    function success(response) {
      return response;
    }
 
    function error(response) {
      var status = response.status;
 
      if (status == 401) {
        //fix for double alert prompting
        /*if(ctr === 1) {
          console.log(ctr);
          alert('Session expired!');
          Security.logout();
          ctr++;
        }*/
      }
      // otherwise
      return $q.reject(response);
    }
 
    return function(promise) {
      return promise.then(success, error);
    }
 
  };
  $httpProvider.responseInterceptors.push(interceptor);
});