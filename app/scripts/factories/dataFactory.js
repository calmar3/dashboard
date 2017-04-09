/**
 * Created by marco on 09/04/17.
 */
(function() {
    'use strict';
    angular.module('monitoringDashboardApp').factory('dataFactory', dataFactory);

    function dataFactory() {
        var dataFactory = {};

        dataFactory.rankData = [];

        dataFactory.setRankData = setRankDataFn;

        dataFactory.getRankData = getRankDataFn;

        function setRankDataFn(rankData) {
            dataFactory.rankData = rankData;
        }

        function getRankDataFn() {
            return dataFactory.rankData;
        }



        return dataFactory;
    }


}());
