(function () {
  'use strict';

  var ControlCtrl = ['$scope', '$rootScope', '$compile', function ($scope, $rootScope, $compile) {

    var ctrl = this;

    ctrl.switch = switchFn;

    ctrl.update = true;


    function switchFn() {
        ctrl.update = !ctrl.update;
        if (ctrl.update){
            setTimeout(updateFn,ctrl.updateInterval);
        }
    }


    ctrl.dataset = [{ data: [], yaxis: 1}];

    ctrl.totalPoints = 100;

    ctrl.updateInterval = 500;

    ctrl.data = [];

    ctrl.options = {
          grid: {
              borderColor: "#f3f3f3",
              tickColor: "#f3f3f3",
              borderWidth: 1
          },
          series: {
              shadowSize: 0, // Drawing is faster without shadows
              color: "#eee313"
          },
          lines: {
              fill: true, //Converts the line chart to area chart
              color: "#eee313"
          },
          yaxis: {
              min: 0,
              max: 100,
              show: true
          },
          xaxis: {
              show: true
          }
      };


      ctrl.dataset[0].data = getRandomData();

      function getRandomData() {

          if (ctrl.data.length > 0)
              ctrl.data = ctrl.data.slice(1);

          // Do a random walk
          while (ctrl.data.length < ctrl.totalPoints) {

              var prev = ctrl.data.length > 0 ? ctrl.data[ctrl.data.length - 1] : 50,
                  y = prev + Math.random() * 10 - 5;

              if (y < 0) {
                  y = 0;
              } else if (y > 100) {
                  y = 100;
              }

              ctrl.data.push(y);
          }

          // Zip the generated y values with the x values
          var res = [];
          for (var i = 0; i < ctrl.data.length; ++i) {
              res.push([i, ctrl.data[i]]);
          }
          return res;
      }

      function updateFn() {

          ctrl.dataset[0].data = getRandomData();

          $scope.$apply();
          if (ctrl.update)
              setTimeout(updateFn, ctrl.updateInterval);
      }


      if (ctrl.update) {
          setTimeout(updateFn,ctrl.updateInterval);
      }





  }];

  ControlCtrl.$inject = ['$scope', '$rootScope', '$compile'];

  angular.module('monitoringDashboardApp').controller('ControlCtrl', ControlCtrl);

}());