'use strict';

/* Services */

angular.module('myApp.servicesApi', ['LocalStorageModule'])
  .value('apiInfo', {
    "url" : 'http://api.deancasili.com'
    }) //change this to the api url
  .factory('Api', function($http, apiInfo, localStorageService) {
    console.log('api');
    var api = apiInfo.url;
    var user_credentials = "";
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
        user_credentials = localStorageService.get("userCreds");

        return user_credentials;
      },
      createRecurringCharges: function(userId, orgId, frequency, startdate, amt) {
        var xsrf = $.param({
            user_id: userId, 
            organization_id: orgId,
            frequency: frequency,
            start_date : startdate,
            amount : amt
          });
        return $http({
          method  : 'POST',
          url     : api + '/user/v1/recurring',
          data    : xsrf,
          headers : {'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8'}
        });
      },
      getSettingList: function(userId) {
        return $http({
          method  : 'GET',          
          url     : api + '/user/v1/recurring',
          params  : {'user_id': userId }
        });
      },
      deleteSetting: function(recurring_id) {
        var xsrf = $.param({recurring_id: recurring_id});
        return $http({
          method  : 'POST',
          url     : api + '/user/v1/delete_recurring',
          data    : xsrf,
          headers : {'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8'}
        });
      },
      postCharges: function(user_id, org_id, amt) {//, benif_id
        var xsrf = $.param({
          user_id: user_id,
          organization_id : org_id,
          // benificiary_id : benif_id,
          amount : amt
        });
        return $http({
          method  : 'POST',
          url     : api + '/donate/v1/charge/',
          data    : xsrf,
          headers : {'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8'}
        });
      }
    };
  });