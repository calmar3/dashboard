(function () {
  'use strict';

  var ControlCtrl = ['$scope', '$rootScope', '$compile','NgMap', function ($scope, $rootScope, $compile,NgMap) {

    var ctrl = this;

    ctrl.switch = switchFn;

    ctrl.update = true;


      NgMap.getMap().then(function(map) {
          console.log('map', map);
          ctrl.map = map;
      });

      ctrl.clicked = function() {
          alert('Clicked a link inside infoWindow');
      };

      ctrl.shops = [
          {id:'foo', name: 'Via dei Fori Imperiali', position:[41.8933281,12.4848003]},
          {id:'bar', name: 'Via di San Giovanni in Laterano', position:[41.8889431,12.4959199]}
      ];
      ctrl.shop = ctrl.shops[0];

      ctrl.showDetail = function(e, shop) {
          ctrl.shop = shop;
          ctrl.map.showInfoWindow('foo-iw', shop.id);
      };

      ctrl.hideDetail = function() {
          ctrl.map.hideInfoWindow('foo-iw');
      };

    function switchFn() {
        ctrl.update = !ctrl.update;
        if (ctrl.update){
            setTimeout(updateFn,ctrl.updateInterval);
        }
    }


    ctrl.dataset = [{ data: [], yaxis: 1}];

    ctrl.totalPoints = 100;

    ctrl.updateInterval = 500;

    ctrl.currentPage = 1;

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

  ControlCtrl.$inject = ['$scope', '$rootScope', '$compile','NgMap'];

  angular.module('monitoringDashboardApp').controller('ControlCtrl', ControlCtrl);

}());