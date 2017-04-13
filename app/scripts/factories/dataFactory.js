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

        dataFactory.host = "http://localhost:6008";

        dataFactory.setRankData = setRankDataFn;

        dataFactory.getRankData = getRankDataFn;

        dataFactory.setLampList = setLampListFn;

        dataFactory.getLampList = getLampListFn;

        dataFactory.getHost = getHostFn;


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



        return dataFactory;
    }


}());
