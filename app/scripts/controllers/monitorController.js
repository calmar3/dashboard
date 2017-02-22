(function () {
  'use strict';

  var MonitorCtrl = ['$scope', '$rootScope', '$compile', function ($scope, $rootScope, $compile) {

    var ctrl = this;

    console.log("monitorctrl");


  }];

  MonitorCtrl.$inject = ['$scope', '$rootScope', '$compile'];

  angular.module('monitoringDashboardApp').controller('MonitorCtrl', MonitorCtrl);

}());