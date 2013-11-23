'use strict';

/* Services */

angular.module('myApp.servicesApi', [])
  .value('apiInfo', {
    "url" : 'http://api.deancasili.com'
    }) //change this to the api url
  .factory('Api', function($http, apiInfo) {
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
      fbLogin: function(postData) {
        // console.log(postData);
        return $http({
          method  : 'POST',
          url     : api + '/user/v1/login',
          data    : postData,
          headers : {'Content-Type' : 'application/json'}
        });
      },
      getListOrganization: function() {
        return $http({
          method  : 'GET',
          url     : api + '/organization/v1/list'
        });
      }
    };
  });