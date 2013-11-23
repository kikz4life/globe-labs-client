'use strict';

/* Services */

angular.module('myApp.servicesApi', ['LocalStorageModule'])
  .value('apiInfo', {
    "url" : 'http://api.deancasili.com'
    }) //change this to the api url
  .factory('Api', function($http, apiInfo, localStorageService) {
    console.log('api');
    var api = apiInfo.url;
    var globeCode = "",
        fbToken = "";

    return {
      setCode: function(value) {
        globeCode = value;
      },
      getCode: function() {
        return globeCode;
      },
      setFbToken: function(value) {
        console.log(value);
        fbToken = value;
      },
      getFbToken: function(){
        return fbToken;
      },
      fbLogin: function(data) {
        var xsrf = $.param({fb_access_token: data});
        // console.log(postData);
        return $http({
          method  : 'POST',
          url     : api + '/user/v1/login',
          data    : xsrf,
          headers : {'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8'}
        });
      },
      getListOrganization: function() {
        return $http({
          method  : 'GET',
          url     : api + '/organization/v1/list'
        });
      },
      getOrgDetail: function(orgID) {
        return $http({
          method  : 'GET',          
          url     : api + '/organization/v1/detail',
          params  : {'organization_id': orgID }
        });
      },
      createGlobeAccessToken: function(code, userId) {
        var xsrf = $.param({code: code, user_id: userId});
        // console.log(postData);
        return $http({
          method  : 'POST',
          url     : api + '/user/v1/access_token',
          data    : xsrf,
          headers : {'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8'}
        });
      },
      getUserCredentials: function() {
        var user_credentials = localStorageService.get("userCreds");

        return user_credentials;
      }
    };
  });