(function () {
  'use strict';

  var ControlCtrl = ['$scope', '$rootScope', '$compile','dataFactory', function ($scope, $rootScope, $compile,dataFactory) {

    var ctrl = this;


      ctrl.entries = [10,50,100,200];

      ctrl.clicked = false;

      ctrl.show=10;

      ctrl.data = dataFactory.getControList();

      ctrl.pagingAction = pagingActionFn;

      ctrl.shift = 0;

      ctrl.dataset = [];

      $scope.$watch(function() {
          return ctrl.show;
      }, function(res) {
          ctrl.pagingAction(1,res);
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
