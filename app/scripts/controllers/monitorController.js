(function () {
  'use strict';

  var MonitorCtrl = ['$scope', '$rootScope', '$compile','NgMap','dataFactory','$http', function ($scope, $rootScope, $compile,NgMap,dataFactory,$http) {

    var ctrl = this;

      //socket.forward('rank', $scope);
      //socket.forward('warning_hour', $scope);
      //socket.forward('warning_day', $scope);
      //socket.forward('warning_week', $scope);
      //socket.forward('hour_lamp_cons', $scope);
      //socket.forward('day_lamp_cons', $scope);
      //socket.forward('week_lamp_cons', $scope);
      //socket.forward('hour_street_cons', $scope);
      //socket.forward('day_street_cons', $scope);
      //socket.forward('week_street_cons', $scope);
      //socket.forward('hour_city_cons', $scope);
      //socket.forward('day_city_cons', $scope);
      //socket.forward('week_city_cons', $scope);

    ctrl.rankData = dataFactory.getRankData();

    ctrl.lampsList = dataFactory.getLampList();

    ctrl.lamps = [];

      ctrl.lamp = ctrl.lampsList[0];

    ctrl.showAlert = true;

      ctrl.pieChartOptions = {thickness: 12, mode: "gauge", total: 100}; //pie-chart option
      ctrl.hourCityCons =  [ {label: "Last Hour", value: 80, color: "#f39c12", suffix: "W"} ];
      ctrl.dayCityCons =  [ {label: "Last Day", value: 80, color: "#f39c12", suffix: "W"} ];
      ctrl.weekCityCons =  [ {label: "Last Week", value: 80, color: "#f39c12", suffix: "W"} ];


    if (ctrl.lampsList.length === 0){
        $http.get(dataFactory.getHost()+'/api/lamps').then(function (response) {

            if (JSON.stringify(ctrl.data) !== JSON.stringify(response.data.lamps)){
                ctrl.lampsList = response.data.lamps;
                dataFactory.setLampList(ctrl.lampsList);
            }
            composeList();
        }).catch(function (error) {
            console.log(error);
        });

    }
    else{
        composeList();
    }


    function composeList() {
        for (var i = 0 ; i < ctrl.lampsList.length ; i++){
            if (ctrl.lampsList[i].latitude !== '0' && ctrl.lampsList[i].longitude !== '0' && ctrl.lampsList[i].lampId!=="2"){
                var tempLamp = ctrl.lampsList[i];
                tempLamp.position = [
                    parseFloat(ctrl.lampsList[i].latitude),
                    parseFloat(ctrl.lampsList[i].longitude)
                ];
                tempLamp.lampId = tempLamp.lampId.toString();
                ctrl.lamps.push(tempLamp);
            }
        }
        ctrl.lamp = ctrl.lamps[0];
        ctrl.warnings = ctrl.lamps.slice(0)
    }



    ctrl.update = true;


/*    $scope.$on('socket:rank', function (ev, data) {
          console.log(data.message);
          dataFactory.setRankData(JSON.parse(data.message));
          ctrl.rankData = dataFactory.getRankData();
          console.log(ctrl.rankData);
      });


      $scope.$on('socket:warning_hour', function (ev, data) {
          console.log(data.message);
          dataFactory.setRankData(JSON.parse(data.message));
          ctrl.rankData = dataFactory.getRankData();
          console.log(ctrl.rankData);
      });

      $scope.$on('socket:warning_day', function (ev, data) {
          console.log(data.message);
          dataFactory.setRankData(JSON.parse(data.message));
          ctrl.rankData = dataFactory.getRankData();
          console.log(ctrl.rankData);
      });


      $scope.$on('socket:warning_week', function (ev, data) {
          console.log(data.message);
          dataFactory.setRankData(JSON.parse(data.message));
          ctrl.rankData = dataFactory.getRankData();
          console.log(ctrl.rankData);
      });


      $scope.$on('socket:hour_lamp_cons', function (ev, data) {
          console.log(data.message);
          dataFactory.setRankData(JSON.parse(data.message));
          ctrl.rankData = dataFactory.getRankData();
          console.log(ctrl.rankData);
      });

      $scope.$on('socket:day_lamp_cons', function (ev, data) {
          console.log(data.message);
          dataFactory.setRankData(JSON.parse(data.message));
          ctrl.rankData = dataFactory.getRankData();
          console.log(ctrl.rankData);
      });

      $scope.$on('socket:week_lamp_cons', function (ev, data) {
          console.log(data.message);
          dataFactory.setRankData(JSON.parse(data.message));
          ctrl.rankData = dataFactory.getRankData();
          console.log(ctrl.rankData);
      });
     $scope.$on('socket:hour_street_cons', function (ev, data) {
         console.log(data.message);
         dataFactory.setRankData(JSON.parse(data.message));
         ctrl.rankData = dataFactory.getRankData();
         console.log(ctrl.rankData);
     });

     $scope.$on('socket:day_street_cons', function (ev, data) {
         console.log(data.message);
         dataFactory.setRankData(JSON.parse(data.message));
         ctrl.rankData = dataFactory.getRankData();
         console.log(ctrl.rankData);
     });

     $scope.$on('socket:week_street_cons', function (ev, data) {
         console.log(data.message);
         dataFactory.setRankData(JSON.parse(data.message));
         ctrl.rankData = dataFactory.getRankData();
         console.log(ctrl.rankData);
     });

     $scope.$on('socket:hour_city_cons', function (ev, data) {
         console.log(data.message);
         dataFactory.setRankData(JSON.parse(data.message));
         ctrl.rankData = dataFactory.getRankData();
         console.log(ctrl.rankData);
     });

     $scope.$on('socket:day_city_cons', function (ev, data) {
         console.log(data.message);
         dataFactory.setRankData(JSON.parse(data.message));
         ctrl.rankData = dataFactory.getRankData();
         console.log(ctrl.rankData);
     });

     $scope.$on('socket:week_city_cons', function (ev, data) {
         console.log(data.message);
         dataFactory.setRankData(JSON.parse(data.message));
         ctrl.rankData = dataFactory.getRankData();
         console.log(ctrl.rankData);
     });



       $scope.$on('socket:warning_week', function (ev, data) {
          console.log(data.message);
          dataFactory.setRankData(JSON.parse(data.message));
          ctrl.rankData = dataFactory.getRankData();
          console.log(ctrl.rankData);
      });

      $scope.$on('socket:error', function (ev, data) {
          console.log("ev","data");

      });*/

      NgMap.getMap().then(function(map) {
          ctrl.map = map;
      });




      ctrl.showDetail = function(e, lamp) {
          ctrl.lamp = lamp;
          console.log(ctrl.map);
          console.log(ctrl.map.infoWindows['foo-iw'].anchor);
          ctrl.showAlert = false;
          ctrl.map.showInfoWindow('foo-iw', ctrl.lamp.lampId);
      };

      ctrl.hideDetail = function() {
          ctrl.map.hideInfoWindow('foo-iw');
      };

/*      ctrl.shops = [
          {id:'1', name: 'Via dei Fori Imperiali', position:[41.8933281,12.4848003]},
          {id:'2', name: 'Via di San Giovanni in Laterano', position:[41.8889431,12.4959199]}
      ];
      ctrl.shop = ctrl.shops[0];

      ctrl.showDetail2 = function(e, shop) {
          ctrl.shop = shop;
          ctrl.map.showInfoWindow('foo-iw', shop.id);
      };

      ctrl.hideDetail2 = function() {
          ctrl.map.hideInfoWindow('foo-iw');
      };*/




  }];

  MonitorCtrl.$inject = ['$scope', '$rootScope', '$compile','NgMap','dataFactory','$http'];

  angular.module('monitoringDashboardApp').controller('MonitorCtrl', MonitorCtrl);

}());
