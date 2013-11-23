'use strict';

/* Services */

angular.module('myApp.servicesApi', [])
  .value('apiInfo', {
    "url" : 'http://localhost/api-server/',
    "key" : 'gBKdrHRyMMeCp5Tr7zcMnGC8kKqkHagB'
    }) //change this to the api url
  .factory('Api', function($http, apiInfo) {
    console.log('api');
    var api = apiInfo.url;
    var globeCode = "";

    return {
      setCode: function(value) {
        globeCode = value;
      },
      getCode: function(value) {
        return globeCode;
      }
    };
  });