'use strict';

/* Controllers */

angular.module('myApp.controllers', ['LocalStorageModule']).
  controller('LoginCtrl', ['$scope', '$location', 'Utils', 'localStorageService', 'Api', function(scope, location, Utils, session, Api) {
  	console.log('loaded loginCtrl');

    // scope.showBanner = false;

  }])

  /* Callback Controller */
  .controller('CallbackCtrl', ['$scope', '$timeout', '$location', 'localStorageService', 'Utils', 'Api', function(scope, timeout, location, session, Utils, Api) {
	console.log('callback loaded');  	
  	//set code  	
    if(! Utils.isEmpty(location.search().code) ) {
    	Api.setCode(location.search().code);
    	// session.add("id", "09e9f116652cdcb4c99cb397fa4a628e");
    	//get session organization
    	var orgId = session.get('id');
    	var code = Api.getCode();
    	var creds = Api.getUserCredentials();

    	// console.log(creds.authResponse.userID);
    	Api.createGlobeAccessToken(code, creds.user.id).then(function(result) {
    		console.log(result);
    	}, function(result) {
    		console.log(result);
    	});


    	timeout(function() {
    		delete location.search().code;
    		location.path('/organizations/detail/' + orgId);
    		//after successful redirect delete session orgId
    		session.remove("id");
    	}, 1000)
    }
  }])

  /* Organization Controller*/
  .controller('OrganizationCtrl', ['$scope', 'Api', '$routeParams', 'localStorageService', function(scope, Api, routeParams, session) {
    scope.showBanner = true;
  	var creds = Api.getUserCredentials();
  	var code = Api.getCode();

    scope.orgDetail = {};
    scope.params = routeParams;
    // scope.hasGlobeAccessToken = creds.user.has_globe_access_token;

    Api.getListOrganization().then(function(result) {
      console.log(result.data);
      scope.orgLists = result.data.result;
    }, function(result) {
      console.log(result.data);
    });

    scope.getDetail = function(orgID) {
      Api.getOrgDetail(orgID).then(function(result) {
        console.log(result.data);
        scope.orgDetail = result.data.result;

        if(! scope.hasGlobeAccessToken) {
	        Api.createGlobeAccessToken(code, creds.user.id).then(function(result) {
				console.log(result);
			}, function(result) {
				console.log(result);
			});
        }else {
        	scope_globeAccessToken = creds.user.globe_access_token;
        }
        
      }, function(result) {
        console.log(result.data);
      });
    };



    scope.storeOrgId = function(id) {
    	console.log(id);
		session.add("id", id);
    };

  }])
  /* Facebook Controller */
  .controller('FacebookCtrl', ['$scope', '$FB', '$window', '$location', 'Api', 'Utils', 'localStorageService' ,function (scope, FB, window, location, Api, Utils, session) {
    
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
          session.add("userCreds", scope.apiMe.result);
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