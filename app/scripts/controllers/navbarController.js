(function () {
  'use strict';

    var NavbarCtrl = ['$scope', '$rootScope', '$compile', '$state', '$stateParams','socket','dataFactory','$http', function ($scope, $rootScope, $compile, $state, $stateParams,socket,dataFactory,$http) {

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
        socket.forward('hour_city_cons', $scope);
        socket.forward('day_city_cons', $scope);
        socket.forward('week_city_cons', $scope);
        socket.forward('adjustment_data', $scope);



        ctrl.collapsemenu = false;

        ctrl.openmenu = false;

        ctrl.state = $state;

        ctrl.switchmenu = switchmenuFn;

        ctrl.go = goFn;

        ctrl.menulist = [
            { label: "Monitor", state: "Monitor", icon: "fa fa-television" },
            { label: "Control", state: "Control", icon: "fa-dot-circle-o" },
            { label: "Lamps Settings", state:"Lamps Settings", icon:"fa fa-gears"}

        ];

        ctrl.init = initFn;

        function goFn(location) {
            $state.go(location);
        }

        function initFn() {
            $http.get(dataFactory.getHost() + '/api/data').then(function (res) {
                dataFactory.setLamps(res.data.lamps);
                dataFactory.setControList(res.data.control);
                dataFactory.setStreetData(res.data.streets);
                dataFactory.setWarnings(res.data.warnings);
                dataFactory.setRankData(res.data.rank);
                dataFactory.setCityData(res.data.city);
                $http.get(dataFactory.getHost() + '/api/lamps').then(function (response) {
                    var data = [];
                    if (JSON.stringify(data) !== JSON.stringify(response.data.lamps)) {
                        data = response.data.lamps;
                    }
                    dataFactory.setLampList(data);
                    if (dataFactory.getLamps().length === 0)
                        composeList();
                    if (dataFactory.getStreetData().length === 0)
                        composeStreets();
                });

            }).catch(function (error) {
                $http.get(dataFactory.getHost() + '/api/lamps').then(function (response) {
                    var data = [];
                    if (JSON.stringify(data) !== JSON.stringify(response.data.lamps)) {
                        data = response.data.lamps;
                    }
                    dataFactory.setLampList(data);
                    composeList();
                    composeStreets();

                });
            });
        }

        function composeList() {
            var lampsList = dataFactory.getLampList();
            var lamps = [];
            for (var i = 0 ; i < lampsList.length ; i++){
                if (lampsList[i].latitude !== '0' && lampsList[i].longitude !== '0' && lampsList[i].lampId!=="2"){
                    var tempLamp = lampsList[i];
                    tempLamp.position = [
                        parseFloat(lampsList[i].latitude),
                        parseFloat(lampsList[i].longitude)
                    ];
                    tempLamp.lampId = tempLamp.lampId.toString();
                    lamps.push(tempLamp);
                }
            }
            dataFactory.setLamps(lamps);
        }

        function composeStreets() {
            var lampsList = dataFactory.getLampList();
            var streetData = [];
            for (var i = 0 ; i < lampsList.length ; i++){
                if (JSON.stringify(streetData).indexOf(JSON.stringify(lampsList[i].address) ) === -1){
                    var street = {
                        address:lampsList[i].address,
                        h_consumption:0,
                        d_consumption:0,
                        w_consumption:0,
                        median: 0
                    };
                    streetData.push(street);
                }
            }
            dataFactory.setStreetData(streetData);
        }

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
        });


        $scope.$on('socket:warning_hour', function (ev, data) {

            var temp = dataFactory.getWarnings();
            if (!temp)
                temp = [];
            temp.splice(0,0,JSON.parse(data.message));
            if (temp.length > 20 ){
                temp.splice(20,temp.length -20)
            }
            dataFactory.setWarnings(temp);
        });

        $scope.$on('socket:warning_day', function (ev, data) {

            var temp = dataFactory.getWarnings();
            if (!temp)
                temp = [];
            temp.splice(0,0,JSON.parse(data.message));
            if (temp.length > 20 ){
                temp.splice(20,temp.length -20)
            }
            dataFactory.setWarnings(temp);
        });


        $scope.$on('socket:warning_week', function (ev, data) {
            var temp = dataFactory.getWarnings();
            if (!temp)
                temp = [];
            temp.splice(0,0,JSON.parse(data.message));
            if (temp.length > 20 ){
                temp.splice(20,temp.length -20)
            }
            dataFactory.setWarnings(temp);
        });


        $scope.$on('socket:hour_lamp_cons', function (ev, data) {
            var lamps = dataFactory.getLamps();
            var temp = JSON.parse(data.message);
            for (var i = 0 ; i < lamps.length ; i++){
                if (parseInt(lamps[i].lampId) === temp.lampId){
                    lamps[i].h_consumption = temp.consumption;
                    break;
                }
            }
            dataFactory.setLamps(lamps);
        });

        $scope.$on('socket:day_lamp_cons', function (ev, data) {
            var temp = JSON.parse(data.message);
            var lamps = dataFactory.getLamps();
            for (var i = 0 ; i < lamps.length ; i++){
                if (parseInt(lamps[i].lampId) === temp.lampId){
                    lamps[i].d_consumption = temp.consumption;
                    break;
                }
            }
            dataFactory.setLamps(lamps);

        });

        $scope.$on('socket:week_lamp_cons', function (ev, data) {
            var temp = JSON.parse(data.message);
            var lamps = dataFactory.getLamps();
            for (var i = 0 ; i < lamps.length ; i++){
                if (parseInt(lamps[i].lampId) === temp.lampId){
                    lamps[i].w_consumption = temp.consumption;
                    break;
                }
            }
            dataFactory.setLamps(lamps);
        });

        $scope.$on('socket:hour_street_cons', function (ev, data) {
            var temp = JSON.parse(data.message);
            var streetData = dataFactory.getStreetData();
            var found = false;
            for (var i = 0 ; i < streetData.length && !found ; i++){
                if (streetData[i].address === temp.id){
                    streetData[i].h_consumption = temp.consumption;
                    found = true;
                }
            }
            if (!found){
                streetData.push({address:temp.id,h_consumption:temp.consumption,d_consumption:0,
                    w_consumption:0,median:0});
            }
            dataFactory.setStreetData(streetData);
        });

        $scope.$on('socket:day_street_cons', function (ev, data) {
            var temp = JSON.parse(data.message);
            var streetData = dataFactory.getStreetData();
            var found = false;
            for (var i = 0 ; i < streetData.length && !found; i++){
                if (streetData[i].address === temp.id){
                    streetData[i].d_consumption = temp.consumption;
                    found = true;
                }
            }
            if (!found){
                streetData.push({address:temp.id,d_consumption:temp.consumption,h_consumption:0,
                    w_consumption:0,median:0});
            }
            dataFactory.setStreetData(streetData);
        });

        $scope.$on('socket:week_street_cons', function (ev, data) {
            var temp = JSON.parse(data.message);
            var streetData = dataFactory.getStreetData();
            var found = false;
            for (var i = 0 ; i < streetData.length && !found; i++){
                if (streetData[i].address === temp.id){
                    streetData[i].w_consumption = temp.consumption;
                    found = true;
                }
            }
            if (!found){
                streetData.push({address:temp.id,w_consumption:temp.consumption,h_consumption:0,
                    d_consumption:0,median:0});
            }
            dataFactory.setStreetData(streetData);
        });




        $scope.$on('socket:warning_state', function (ev, data) {
            var temp = dataFactory.getWarnings();
            if (!temp)
                temp = [];
            temp.splice(0,0,JSON.parse(data.message));
            if (temp.length > 20 ){
                temp.splice(20,temp.length -20)
            }
            dataFactory.setWarnings(temp);
        });

        $scope.$on('socket:adjustment_data', function (ev, data) {
            var temp = dataFactory.getControList();
            if (!temp)
                temp = [];
            temp.splice(0,0,JSON.parse(data.message));
            if (temp.length > 100 ){
                temp.splice(100,temp.length -100)
            }
            dataFactory.setControList(temp);
        });

        $scope.$on('socket:median', function (ev, data) {

            var temp = JSON.parse(data.message);
            var streetData = dataFactory.getStreetData();
            for (var i = 0 ; i < streetData.length ; i++){
                if (streetData[i].address === temp.f0){
                    streetData[i].median = temp.f1;
                    break;
                }
            }
            dataFactory.setStreetData(streetData);
        });

        $scope.$on('socket:hour_city_cons', function (ev, data) {
            var temp = dataFactory.getCityData();
            temp[0][0].value = parseFloat(data.message).toFixed(2);
            dataFactory.setCityData(temp);
        });

        $scope.$on('socket:day_city_cons', function (ev, data) {
            var temp = dataFactory.getCityData();
            temp[1][0].value = parseFloat(data.message).toFixed(2);
            dataFactory.setCityData(temp);
        });

        $scope.$on('socket:week_city_cons', function (ev, data) {
            var temp = dataFactory.getCityData();
            temp[2][0].value = parseFloat(data.message).toFixed(2);
            dataFactory.setCityData(temp);
        });

        $scope.$on('socket:error', function (ev, data) {
            console.log("ev","data");

        });

        setInterval(function () {

            var data = {
                control:dataFactory.getControList(),
                streets:dataFactory.getStreetData(),
                lamps:dataFactory.getLamps(),
                rank:dataFactory.getRankData(),
                warnings:dataFactory.getWarnings(),
                city:dataFactory.getCityData()
            };
            $http.post(dataFactory.getHost()+'/api/data',data).then(function (response) {

                console.log("save success");

            }).catch(function (error) {
                console.log("save failed");
            });
        },1000*60*5);

        function switchmenuFn() {

            if (parseInt($(window).width()) > 752) {
                ctrl.collapsemenu = !ctrl.collapsemenu;

            } else {

                ctrl.openmenu = !ctrl.openmenu;
            }
        }


        var w = $(window).height();
        var mh = parseInt($('#header').css('height'));
        ctrl.minheight = w - mh;

    }];

    NavbarCtrl.$inject = ['$scope', '$rootScope', '$compile', '$state', '$stateParams','socket','dataFactory','$http'];

    angular.module('monitoringDashboardApp').controller('NavbarCtrl', NavbarCtrl);
} ());
