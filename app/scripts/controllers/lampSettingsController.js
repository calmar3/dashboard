(function () {
  'use strict';

  var LampSettingsCtrl = ['$scope', '$rootScope', '$compile', function ($scope, $rootScope, $compile) {

    var ctrl = this;

    console.log("LampSettingsCtrl");


  }];

  LampSettingsCtrl.$inject = ['$scope', '$rootScope', '$compile'];

  angular.module('monitoringDashboardApp').controller('LampSettingsCtrl', LampSettingsCtrl);

}());