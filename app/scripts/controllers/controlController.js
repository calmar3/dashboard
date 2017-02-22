(function () {
  'use strict';

  var ControlCtrl = ['$scope', '$rootScope', '$compile', function ($scope, $rootScope, $compile) {

    var ctrl = this;
    console.log("controlctrl");

  }];

  ControlCtrl.$inject = ['$scope', '$rootScope', '$compile'];

  angular.module('monitoringDashboardApp').controller('ControlCtrl', ControlCtrl);

}());