'use strict';

/* Controllers */

angular.module('myApp.controllers', []).
  controller('LoginCtrl', ['$scope', '$location', 'Utils', 'Api', function(scope, location, Utils, Api) {
  	console.log('loaded loginCtrl');
  
    //set code  	
    if(! Utils.isEmpty(location.search().code) ) Api.setCode(location.search().code);


  }])
  /* Organization Controller*/
  .controller('OrganizationCtrl', ['$scope', 'Api', function(scope, Api) {
    Api.getListOrganization().then(function(result) {
      console.log(result.data);
      scope.orgLists = result.data.result;
      console.log(scope.orgLists);
    }, function(result) {
      console.log(result.data);
    })
  }])
  /* Facebook Controller */
  .controller('FacebookCtrl', ['$scope', '$FB', '$window', '$location', 'Api' ,function (scope, FB, window, location, Api) {
  
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
      // console.log(val)
      scope.loginStatusJSON = val;
      //set Facebook token
      console.log(val);
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