'use strict';

/* Common */

// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('myApp.services', [])
  .value('version', '0.1')
  .factory('Utils', ['$rootScope','$http', '$filter', '$q', function(rootScope, $http, $filter, $q) {
    return {
      timeConverter: function(UNIX_timestamp, showHours) {
        UNIX_timestamp = eval(UNIX_timestamp);
        var a = new Date(UNIX_timestamp);
        var time;
      
        // if(showHours) $filter("date")(a, "MMM d, yyyy HH:mm:ss .sss");
        if(showHours) time = $filter("date")(a, "MMM d, yyyy HH:mm:ss");
        else time = $filter("date")(a, "MMM d, yyyy");
      
        return time;
      },
      isEmpty: function (str) {
        return (!str || 0 === str.length);
      },
      isBlank: function(str) {
        return (!str || /^\s*$/.test(str));
      },
      nextChar: function(c) {
        return String.fromCharCode(c.charCodeAt(0) + 1);
      },
      convertIntegerToChar: function(n) {
        return String.fromCharCode(97 + n);
      },
      dateToTimestampOld: function(date, time) {
        if(this.isEmpty(date) || this.isEmpty(time)) return false;
        
        var day = date.getDate();
        var month = eval(date.getMonth() + 1); //add +1 since month return 0-11
        var year = date.getFullYear();
        var newDate;

        newDate = month + '/' + day + '/' + year + ' ' + time;
        newDate = new Date(newDate).getTime();

        return newDate;
      },
      dateToTimestamp: function(date, time) {
        console.log(time);

        if(this.isEmpty(date) || this.isEmpty(time)) return false;

        var day = date.getDate();
        var month = eval(date.getMonth() + 1); //add +1 since month return 0-11
        var year = date.getFullYear();
        var newDate;
        //remove am/pm or meridiem
        time = this.removeMeridiem(time)
        
        console.log(time);

        newDate = month + '/' + day + '/' + year + ' ' + time;
        newDate = new Date(newDate).getTime();

        return newDate;
      }
    };
  }]);