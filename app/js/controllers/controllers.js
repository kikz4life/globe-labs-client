'use strict';

/* Controllers */

angular.module('myApp.controllers', ['LocalStorageModule']).
  controller('HomeCtrl', ['$scope', '$location', 'Utils', 'localStorageService', 'Api', function(scope, location, Utils, session, Api) {
    console.log('loaded homeCtrl');

  }])


  .controller('LoginCtrl', ['$scope', '$location', 'Utils', 'localStorageService', 'Api', function(scope, location, Utils, session, Api) {
  	console.log('loaded loginCtrl');

  }])

  /* Callback Controller */
  .controller('CallbackCtrl', ['$scope', '$timeout', '$location', 'localStorageService', 'Utils', 'Api', function(scope, timeout, location, session, Utils, Api) {
	console.log('callback loaded');  	
  	//set code  	
    if(! Utils.isEmpty(location.search().code) ) {
    	Api.setCode(location.search().code);
      //add code
    	// session.add("id", location.search().code);
    	//get session organization
    	var orgId = session.get('id');
    	var code = Api.getCode();
    	var creds = Api.getUserCredentials();

    	// console.log(creds.authResponse.userID);
/*    	Api.createGlobeAccessToken(code, creds.user.id).then(function(result) {
    		console.log(result);
    	}, function(result) {
    		console.log(result);
    	});
*/

    	timeout(function() {
    		delete location.search().code;
    		location.path('/organizations/detail/' + orgId);
    		//after successful redirect delete session orgId
    		session.remove("id");
    	}, 1000)
    }
  }])

  /* Organization Controller*/
  .controller('OrganizationCtrl', ['$scope', '$rootScope', '$routeParams', 'localStorageService', 'Api', 'Utils', function(scope, rootScope, routeParams, session, Api, Utils) {
    var creds = Api.getUserCredentials();
    var code = Api.getCode();

    scope.showBanner = true;
    scope.orgDetail = {};
    scope.params = routeParams;
    scope.hasGlobeAccessToken = (Utils.isEmpty(creds)) ? "" : creds.user.has_globe_access_token;
    scope.isLoggedIn = (Utils.isEmpty(creds)) ? false : true;
    scope.tarrif_rate = 0;
    console.log(scope.isLoggedIn);

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
        console.log(scope.hasGlobeAccessToken);
        if(!scope.isLoggedIn) return false;
        if(eval(scope.hasGlobeAccessToken) != 1) {
          console.log('if');
	        Api.createGlobeAccessToken(code, creds.user.id).then(function(result) {
            console.log('createGlobeAccessToken');
    				console.log(result);
    			}, function(result) {
    				console.log(result);
    			});
        }else {
          console.log('else');
        	scope.globeAccessToken = creds.user.globe_access_token;
        }
        
      }, function(result) {
        console.log(result.data);
      });
    };
        
    scope.donateNow = function() {
      var user_id = creds.user.id;
      var org_id = scope.params.orgId;
      // var benif_id = ;
      var amt = scope.tarrif_rate;

      Api.postCharges(user_id, org_id, amt).then(function(result){
        console.log(result.data);
        rootScope.$broadcast("event:donated", amt);
        
      }, function(result) {
        console.log(result.data);
        scope.showError = true;
        scope.data = 'Warning! '+result.data.message;
      })
    };

    scope.$on("event:donated", function(event, newValue, oldValue) {
      console.log(scope.orgDetail);
      scope.getDetail(scope.params.orgId);
    })


    scope.storeOrgId = function(id) {
      console.log(id);
      session.add("id", id);
    };

    scope.$on("event:loggedOut", function() {
      console.log('boom');
      scope.isLoggedIn = false;
    });

    scope.$on("event:loggedIn", function() {
      console.log('boom');
      scope.isLoggedIn = true;
    });
  }])
  /* Facebook Controller */
  .controller('FacebookCtrl', ['$scope', '$rootScope', '$FB', '$window', '$location', 'Api', 'Utils', 'localStorageService' ,function (scope, rootScope, FB, window, location, Api, Utils, session) {
    
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
        session.clearAll();
        rootScope.$broadcast("event:loggedOut");
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
          rootScope.$broadcast("event:loggedIn");
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
  }])
  /* Settings Cotroller */
  .controller('SettingCtrl', ['$scope', '$location', 'Api', 'Utils', function(scope, location, Api, Utils) {
    console.log('settings controller');

    var creds = Api.getUserCredentials();
  var code = Api.getCode();
  var user_id = creds.user.id;
    
    scope.organization = {};

    Api.getListOrganization().then(function(result) {
      scope.listOfOrg = result.data.result;
      console.log(result.data);
    }, function(result){
      console.log(result.data);
    });
  
  scope.frequency_data = [
    {id : "day", name : "Daily"},
    {id : "week", name : "Weekly"},
    {id : "month", name : "Monthly"}  
  ];

  scope.settingList = function() {
    Api.getSettingList(user_id).then(function(result) {
      console.log(result.data);
      scope.datas = result.data.result;
    }, function(result){
      console.log(result.data);
    })
  }

    scope.saveSetting = function () {
      var org_id = scope.organization.selected.id;
      var freq = scope.frequency;
      var start_date = Utils.dateToTimestampOld(scope.startdate);
    var amount = scope.amount;      

      Api.createRecurringCharges(user_id, org_id, freq, start_date, amount).then(function(result) {
        console.log(result.data);
        // scope.settingList = result.data.result;
      }, function(result){
        console.log(result);
      })
    };

    scope.deleteItem = function(item, id) {
      
      var index = scope.datas.indexOf(item)
      
      scope.datas.splice(index,1);  
      
      Api.deleteSetting(id).then(function(result){
        console.log(result.data);
      },function(result) {
        console.log(result);
      })
    };

    scope.settingList();
  }]);
