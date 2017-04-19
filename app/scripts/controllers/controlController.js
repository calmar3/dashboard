(function () {
  'use strict';

  var ControlCtrl = ['$scope', '$rootScope', '$compile','socket','dataFactory', function ($scope, $rootScope, $compile,socket,dataFactory) {

    var ctrl = this;

      socket.forward('rank', $scope);

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

      $scope.$on('socket:rank', function (ev, data) {
          console.log(data.message);

      });


      function pagingActionFn( page, pageSize) {

          ctrl.shift = Math.floor(pageSize*(page-1));
          ctrl.dataset = JSON.parse(JSON.stringify(ctrl.data));
          ctrl.dataset = ctrl.dataset.splice(ctrl.shift,pageSize);
          ctrl.currentPage = page;
      }



      ctrl.dataset = ctrl.data.slice(0);

  }];

  ControlCtrl.$inject = ['$scope', '$rootScope', '$compile','socket','dataFactory'];

  angular.module('monitoringDashboardApp').controller('ControlCtrl', ControlCtrl);

}());
