'use strict';

/* Controllers */

angular.module('myApp.controllers', ['LocalStorageModule']).
  controller('LoginCtrl', ['$scope', '$location', 'Utils', 'localStorageService', 'Api', function(scope, location, Utils, session, Api) {
  	console.log('loaded loginCtrl');
  
  }])

  /* Callback Controller */
  .controller('CallbackCtrl', ['$scope', '$timeout', '$location', 'localStorageService', 'Utils', 'Api', function(scope, timeout, location, session, Utils, Api) {
  	//set code  	
    if(! Utils.isEmpty(location.search().code) ) {
    	Api.setCode(location.search().code);
    	// session.add("id", "09e9f116652cdcb4c99cb397fa4a628e");
    	//get session organization
    	var orgId = session.get('id');

    	timeout(function() {
    		delete location.search().code;
    		location.path('/organization/' + orgId);
    		//after successful redirect delete session orgId
    		session.clearAll();
    	}, 1000)
    }
  }])

  /* Organization Controller*/
  .controller('OrganizationCtrl', ['$scope', 'Api', '$routeParams', function(scope, Api, routeParams) {

    scope.orgDetail = {};
    scope.params = routeParams;

    Api.getListOrganization().then(function(result) {
      console.log(result.data);
      scope.orgLists = result.data.result;
      console.log(scope.orgLists);
    }, function(result) {
      console.log(result.data);
    });

    scope.getDetail = function(orgID) {
      Api.getOrgDetail(orgID).then(function(result) {
        console.log(result.data);
        scope.orgDetail = result.data.result;
        console.log(scope.orgDetail);
      }, function(result) {
        console.log(result.data);
      });
    };

  }])
  /* Facebook Controller */
  .controller('FacebookCtrl', ['$scope', '$FB', '$window', '$location', 'Api', 'Utils' ,function (scope, FB, window, location, Api, Utils) {
  
    updateLoginStatus(updateApiMe);
    // console.log(FB);
    scope.login = function () {
      FB.login(function (res) {
        /**
         * no manual scope.$apply, I got that handled
         */
        if (res.authResponse) {
          updateLoginStatus(updateApiMe);
        }
      }, {scope: 'email,user_likes'});
    };

    scope.logout = function () {
      FB.logout(function () {
        updateLoginStatus(updateApiMe);
      });
    };

    scope.$watch("loginStatus", function(val) {
      scope.loginStatusJSON = val;
    }, true);

    scope.$watch("apiMe", function(val) {
      scope.apiMeJSON = val;
    }, true);

    scope.share = function () {
      FB.ui(
        {
          method: 'feed',
          name: 'Testing',
          picture: 'http://plnkr.co/img/plunker.png',
          link: 'http://plnkr.co/edit/qclqht?p=preview',
          description: ' Facebook integration in AngularJS made easy!' + 
                       ' Please try it and feel free to give feedbacks.'
        },
        function(response) {
          // console.log(response);
        }
      );
    };
    
    function updateLoginStatus (more) {
      FB.getLoginStatus(function (res) {
        scope.loginStatus = res;
        if( Utils.isEmpty(res.authResponse) ) return false;
        //set Fb token
        Api.setFbToken(res.authResponse.accessToken);
        //HTTP post
        var postData = Api.getFbToken();
        Api.fbLogin(postData).then(function(result){
          console.log(result);
          scope.apiMe = result.data;
        }, function(result) {
          console.log(result);
        });

        (more || angular.noop)();
      });
    }

    function updateApiMe () {
      FB.api('/me', function (res) {
        // scope.apiMe = res;
      });
    }
  }])
  .controller('headerCtrl', ['$scope', '$location', function(scope, location) {
    console.log('header controller');
    scope.isActive = function(loc){
      return loc === location.path();
    };
  }]);