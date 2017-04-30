(function () {

    'use strict';

    var MonitorCtrl = ['$scope', '$rootScope', '$compile','NgMap','dataFactory','$http', function ($scope, $rootScope, $compile,NgMap,dataFactory,$http) {

        var ctrl = this;

        ctrl.entries = [10,50,100,200];

        ctrl.warnings = [];

        ctrl.show=10;

        ctrl.lamps = [];

        ctrl.rankData = dataFactory.getRankData();

        ctrl.streetData = dataFactory.getStreetData();

        ctrl.cityData = dataFactory.getCityData();

        ctrl.warnings = dataFactory.getWarnings();

        ctrl.lamps = dataFactory.getLamps();

        ctrl.pieChartOptions = {thickness: 12, mode: "gauge", total: 100}; //pie-chart option

        if (ctrl.cityData.length > 0 ){
            var max = 0;
            for (var i = 0 ; i < ctrl.cityData.length ; i++){
                if (ctrl.cityData[i][0].value >= max){
                    max = ctrl.cityData[i][0].value;
                }
            }
            if (max > 100)
                ctrl.pieChartOptions.total = Math.ceil(max);
        }



        ctrl.showAlert = true;

        ctrl.update = true;

        ctrl.testOptions =

        ctrl.interval = false;

        ctrl.streetDataset = ctrl.streetData;

        ctrl.pagingAction = pagingActionFn;

        ctrl.shift = 0;

        ctrl.deleteWarning = deleteWarningFn;

        ctrl.currentPage = 1;

        if (ctrl.rankData.length>0){
            ctrl.interval = true;
            setTimeout(updateRank(),5000);
        }

        $scope.$watch(function() {
            return dataFactory.updateStreetData;
        }, function(res) {
            ctrl.streetData = dataFactory.getStreetData();
            ctrl.pagingAction(1,ctrl.show);
        });

        $scope.$watch(function() {
            return dataFactory.updateCityData;
        }, function(res) {
            ctrl.cityData = dataFactory.getCityData();
            if (ctrl.cityData.length > 0 ){
                var max = 0;
                for (var i = 0 ; i < ctrl.cityData.length ; i++){
                    if (ctrl.cityData[i][0].value >= max){
                        max = ctrl.cityData[i][0].value;
                    }
                }
                if (max > 100)
                    ctrl.pieChartOptions.total = Math.ceil(max);
            }
        });


        $scope.$watch(function() {
            return dataFactory.warnings;
        }, function(res) {
            ctrl.warnings = dataFactory.getWarnings();

        });

        $scope.$watch(function() {
            return dataFactory.updateLamps;
        }, function(res) {
            ctrl.lamps = dataFactory.getLamps();
            if (!ctrl.lamp)
                ctrl.lamp = ctrl.lamps[0];

        });

        $scope.$watch(function() {
            return dataFactory.rankData;
        }, function(res) {
            ctrl.rankData = dataFactory.getRankData();
            if (!ctrl.interval){
                ctrl.interval = true;
                setTimeout(updateRank(),5000);
            }

        });

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


  MonitorCtrl.$inject = ['$scope', '$rootScope', '$compile','NgMap','dataFactory','$http'];

  angular.module('monitoringDashboardApp').controller('MonitorCtrl', MonitorCtrl);

}());
