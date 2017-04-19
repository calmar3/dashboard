(function () {

    'use strict';
var MonitorCtrl = ['$scope', '$rootScope', '$compile','NgMap','socket','dataFactory','$http', function ($scope, $rootScope, $compile,NgMap,socket,dataFactory,$http) {

    var ctrl = this;

     socket.forward('rank', $scope);
     socket.forward('warning_hour', $scope);
     socket.forward('warning_day', $scope);
     socket.forward('warning_week', $scope);
     socket.forward('hour_lamp_cons', $scope);
     socket.forward('day_lamp_cons', $scope);
     socket.forward('week_lamp_cons', $scope);
     socket.forward('hour_street_cons', $scope);
     socket.forward('day_street_cons', $scope);
     socket.forward('week_street_cons', $scope);
     socket.forward('hour_city_cons', $scope);
     socket.forward('day_city_cons', $scope);
     socket.forward('week_city_cons', $scope);
     socket.forward('warning_state', $scope);
     socket.forward('median', $scope);

    ctrl.entries = [10,50,100,200];

    ctrl.warnings = [];

    ctrl.show=10;

    ctrl.rankData = dataFactory.getRankData();

    ctrl.lampsList = dataFactory.getLampList();

    ctrl.lamps = [];

    ctrl.lamp = ctrl.lampsList[0];

    ctrl.showAlert = true;

    ctrl.update = true;

    ctrl.streetData = dataFactory.getStreetData();

    ctrl.streetDataset = ctrl.streetData.slice(0);

    ctrl.pagingAction = pagingActionFn;

    ctrl.shift = 0;

    ctrl.deleteWarning = deleteWarningFn;

    ctrl.warnings = dataFactory.getWarnings();

    ctrl.currentPage = 1;

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
            composeStreets();
        }).catch(function (error) {
            console.log(error);
        });

    }
    else{
        composeList();
        composeStreets();
    }

    $scope.$watch(function() {
        return ctrl.show;
    }, function(res) {
        ctrl.pagingAction(1,res);
    });

    function pagingActionFn( page, pageSize) {
        ctrl.shift = Math.floor(pageSize*(page-1));
        ctrl.streetDataset = JSON.parse(JSON.stringify(ctrl.streetData));
        ctrl.streetDataset = ctrl.streetDataset.splice(ctrl.shift,pageSize);
        ctrl.currentPage = page;
    }


    function deleteWarningFn(index) {
        ctrl.warnings.splice(index,1);
        dataFactory.setWarnings(ctrl.warnings);
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
    }

    function composeStreets() {
        for (var i = 0 ; i < ctrl.lampsList.length ; i++){
            if (JSON.stringify(ctrl.streetData).indexOf(JSON.stringify(ctrl.lampsList[i].address) ) === -1){
                var street = {
                    address:ctrl.lampsList[i].address,
                    h_consumption:0,
                    d_consumption:0,
                    w_consumption:0,
                    median: 0
                };
                ctrl.streetData.push(street);
            }
        }
        dataFactory.setStreetData(ctrl.streetData);
        ctrl.streetDataset = ctrl.streetData.slice(0);
    }



    function updateRank() {
        setInterval(function () {
            for (var i = 0 ; i < ctrl.rankData.length ; i++){

                ctrl.rankData[i].residualLifeTime = ctrl.rankData[i].residualLifeTime + 1000;
                var difference = ctrl.rankData[i].residualLifeTime;
                ctrl.rankData[i].day = Math.floor(difference/1000/60/60/24);
                difference -= ctrl.rankData[i].day*1000*60*60*24;
                ctrl.rankData[i].hour = Math.floor(difference/1000/60/60);
                difference -= ctrl.rankData[i].hour*1000*60*60;
                ctrl.rankData[i].minutes = Math.floor(difference/1000/60);
                difference -= ctrl.rankData[i].minutes*1000*60;
                ctrl.rankData[i].seconds = Math.floor(difference/1000);

                ctrl.rankData[i].residualLifeTimeShow = JSON.stringify(ctrl.rankData[i].day)
                    + ":"+ JSON.stringify(ctrl.rankData[i].hour)+ ":"+ JSON.stringify(ctrl.rankData[i].minutes)+":"+
                    JSON.stringify(ctrl.rankData[i].seconds);
            }
            dataFactory.setRankData(ctrl.rankData);
            $scope.$apply();
        },1000);
    }

    setTimeout(updateRank,5000);


    $scope.$on('socket:rank', function (ev, data) {

         var temp = (JSON.parse(data.message));

            for (var i = 0 ; i < temp.length ; i++){

                var difference = temp[i].residualLifeTime;
                temp[i].day = Math.floor(difference/1000/60/60/24);
                difference -= temp[i].day*1000*60*60*24;
                temp[i].hour = Math.floor(difference/1000/60/60);
                difference -= temp[i].hour*1000*60*60;
                temp[i].minutes = Math.floor(difference/1000/60);
                difference -= temp[i].minutes*1000*60;
                temp[i].seconds = Math.floor(difference/1000);

                temp[i].residualLifeTimeShow = JSON.stringify(temp[i].day)
                    + ":"+ JSON.stringify(temp[i].hour)+ ":"+ JSON.stringify(temp[i].minutes)+":"+
                    JSON.stringify(temp[i].seconds);
            }
         dataFactory.setRankData(temp);
         ctrl.rankData = dataFactory.getRankData();
     });


     $scope.$on('socket:warning_hour', function (ev, data) {
        ctrl.warnings.splice(0,0,JSON.parse(data.message));
         dataFactory.setWarnings(ctrl.warnings);
     });

     $scope.$on('socket:warning_day', function (ev, data) {
         ctrl.warnings.splice(0,0,JSON.parse(data.message));
         dataFactory.setWarnings(ctrl.warnings);
     });


     $scope.$on('socket:warning_week', function (ev, data) {
         ctrl.warnings.splice(0,0,JSON.parse(data.message));
         dataFactory.setWarnings(ctrl.warnings);
     });


     $scope.$on('socket:hour_lamp_cons', function (ev, data) {
            var temp = JSON.parse(data.message);
            for (var i = 0 ; i < ctrl.lamps.length ; i++){
                if (parseInt(ctrl.lamps[i].lampId) === temp.lampId){
                    ctrl.lamps[i].h_consumption = temp.consumption;
                    break;
                }
            }
         dataFactory.setLampList(ctrl.lamps);
     });

     $scope.$on('socket:day_lamp_cons', function (ev, data) {
         var temp = JSON.parse(data.message);
         for (var i = 0 ; i < ctrl.lamps.length ; i++){
             if (parseInt(ctrl.lamps[i].lampId) === temp.lampId){
                 ctrl.lamps[i].d_consumption = temp.consumption;
                 break;
             }
         }
         dataFactory.setLampList(ctrl.lamps);

     });

     $scope.$on('socket:week_lamp_cons', function (ev, data) {
         var temp = JSON.parse(data.message);
         for (var i = 0 ; i < ctrl.lamps.length ; i++){
             if (parseInt(ctrl.lamps[i].lampId) === temp.lampId){
                 ctrl.lamps[i].w_consumption = temp.consumption;
                 break;
             }
         }
         dataFactory.setLampList(ctrl.lamps);
     });

     $scope.$on('socket:hour_street_cons', function (ev, data) {
         var temp = JSON.parse(data.message);
         for (var i = 0 ; i < ctrl.streetData.length ; i++){
             if (ctrl.streetData[i].address === temp.id){
                 ctrl.streetData[i].h_consumption = temp.consumption;
                 break;
             }
         }
         pagingActionFn(ctrl.currentPage,ctrl.show);
         dataFactory.setStreetData(ctrl.streetData);
     });

     $scope.$on('socket:day_street_cons', function (ev, data) {
         var temp = JSON.parse(data.message);
         for (var i = 0 ; i < ctrl.streetData.length ; i++){
             if (ctrl.streetData[i].address === temp.id){
                 ctrl.streetData[i].d_consumption = temp.consumption;
                 break;
             }
         }
         pagingActionFn(ctrl.currentPage,ctrl.show);
         dataFactory.setLampList(ctrl.streetData);
     });

     $scope.$on('socket:week_street_cons', function (ev, data) {
         var temp = JSON.parse(data.message);
         for (var i = 0 ; i < ctrl.streetData.length ; i++){
             if (ctrl.streetData[i].address=== temp.id){
                 ctrl.streetData[i].w_consumption = temp.consumption;
                 break;
             }
         }
         pagingActionFn(ctrl.currentPage,ctrl.show);
         dataFactory.setLampList(ctrl.streetData);
     });

     $scope.$on('socket:hour_city_cons', function (ev, data) {
         ctrl.hourCityCons[0].value = parseFloat(data.message).toFixed(2);
     });

     $scope.$on('socket:day_city_cons', function (ev, data) {
         ctrl.dayCityCons[0].value = parseFloat(data.message).toFixed(2);
     });

     $scope.$on('socket:week_city_cons', function (ev, data) {
         ctrl.weekCityCons[0].value = parseFloat(data.message).toFixed(2);
     });


     $scope.$on('socket:warning_state', function (ev, data) {
         ctrl.warnings.splice(0,0,JSON.parse(data.message));
         dataFactory.setWarnings(ctrl.warnings);
     });

    $scope.$on('socket:median', function (ev, data) {
        var temp = JSON.parse(data.message);
        for (var i = 0 ; i < ctrl.streetData.length ; i++){
            if (ctrl.streetData[i].address === temp.f0){
                ctrl.streetData[i].median = temp.f1;
                break;
            }
        }
        pagingActionFn(ctrl.currentPage,ctrl.show);
        dataFactory.setLampList(ctrl.streetData);
    });

     $scope.$on('socket:error', function (ev, data) {
     console.log("ev","data");

     });

    NgMap.getMap().then(function(map) {
        ctrl.map = map;
    });




    ctrl.showDetail = function(e, lamp) {
        ctrl.lamp = lamp;
        ctrl.showAlert = false;
        ctrl.map.showInfoWindow('foo-iw', ctrl.lamp.lampId);
    };

    ctrl.hideDetail = function() {
        ctrl.map.hideInfoWindow('foo-iw');
    };





}];


  MonitorCtrl.$inject = ['$scope', '$rootScope', '$compile','NgMap','socket','dataFactory','$http'];

  angular.module('monitoringDashboardApp').controller('MonitorCtrl', MonitorCtrl);

}());
