/**
 * Created by marco on 09/04/17.
 */
(function() {
    'use strict';
    angular.module('monitoringDashboardApp').factory('dataFactory', dataFactory);

    function dataFactory() {
        var dataFactory = {};

        dataFactory.rankData = [];

        dataFactory.lampList = [];

        dataFactory.controList = [];

        dataFactory.streetData = [];

        dataFactory.warnings = [];

        dataFactory.lamps = [];

        dataFactory.updateStreetData = 0;

        dataFactory.updateLamps = 0;

        dataFactory.updateCityData=0;

        dataFactory.cityData = [
             [ {label: "Last Hour", value: 0, color: "#f39c12", suffix: "W"} ],
                [ {label: "Last Day", value: 0, color: "#f39c12", suffix: "W"} ],
            [ {label: "Last Week", value: 0, color: "#f39c12", suffix: "W"} ]
        ];

        dataFactory.host = "http://light-system.mybluemix.net";

        dataFactory.setRankData = setRankDataFn;

        dataFactory.getRankData = getRankDataFn;

        dataFactory.setLampList = setLampListFn;

        dataFactory.getLampList = getLampListFn;

        dataFactory.getHost = getHostFn;

        dataFactory.getControList = getControlListFn;

        dataFactory.setControList = setControlListFn;

        dataFactory.getStreetData = getStreetDataFn;

        dataFactory.setStreetData = setStreetDataFn;

        dataFactory.getWarnings = getWarningsFn;

        dataFactory.setWarnings = setWarningsFn;

        dataFactory.getLamps = getLampsFn;

        dataFactory.setLamps = setLampsFn;

        dataFactory.setCityData = setCityDataFn;

        dataFactory.getCityData = getCityDataFn;

        function setCityDataFn(cityData) {
            dataFactory.updateCityData++;
            dataFactory.cityData = cityData;
        }

        function getCityDataFn() {
            return dataFactory.cityData;
        }

        function getLampsFn() {
            return dataFactory.lamps;
        }

        function setLampsFn(lamps) {
            dataFactory.updatelamps++;
            dataFactory.lamps = lamps;
        }



        function getStreetDataFn() {
            return dataFactory.streetData;
        }

        function setStreetDataFn(streetData) {
            dataFactory.updateStreetData++;
            dataFactory.streetData = streetData;
        }

        function getControlListFn() {
            return dataFactory.controList;
        }

        function setControlListFn(controlList) {
            dataFactory.controList = controlList;
        }

        function setRankDataFn(rankData) {
            dataFactory.rankData = rankData;
        }

        function getRankDataFn() {
            return dataFactory.rankData;
        }

        function setLampListFn(lampList) {
            dataFactory.lampList = lampList;
        }

        function getLampListFn() {
            return dataFactory.lampList;
        }


        function getHostFn() {
            return dataFactory.host;
        }

        function setWarningsFn(warnings) {
            dataFactory.warnings = warnings;
        }

        function getWarningsFn() {
            return dataFactory.warnings;
        }



        return dataFactory;
    }


}());
