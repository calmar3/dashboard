(function () {
  'use strict';

  var ControlCtrl = ['$scope', '$rootScope', '$compile','dataFactory', function ($scope, $rootScope, $compile,dataFactory) {

    var ctrl = this;


      ctrl.entries = [10,50,100];

      ctrl.show=10;

      ctrl.data = dataFactory.getControList();

      ctrl.dataset = ctrl.data.slice(0);

      ctrl.pagingAction = pagingActionFn;

      ctrl.shift = 0;

      ctrl.dataset = [];

      ctrl.currentPage=1;

      $scope.$watch(function() {
          return ctrl.show;
      }, function(res) {
          ctrl.pagingAction(1,res);
      });

      $scope.$watch(function() {
          return dataFactory.controList;
      }, function(res) {
          ctrl.data = dataFactory.getControList().slice(0);
          pagingActionFn(ctrl.currentPage,ctrl.show);
      });


      function pagingActionFn( page, pageSize) {

          ctrl.shift = Math.floor(pageSize*(page-1));
          ctrl.dataset = JSON.parse(JSON.stringify(ctrl.data));
          ctrl.dataset = ctrl.dataset.splice(ctrl.shift,pageSize);
          ctrl.currentPage = page;
      }



      ctrl.dataset = ctrl.data.slice(0);

  }];

  ControlCtrl.$inject = ['$scope', '$rootScope', '$compile','dataFactory'];

  angular.module('monitoringDashboardApp').controller('ControlCtrl', ControlCtrl);

}());
