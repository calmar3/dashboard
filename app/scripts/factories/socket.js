/**
 * Service to get a socket linked with server
 */

(function() {
    'use strict';
    angular.module('monitoringDashboardApp').factory('socket', socket);

    function socket(socketFactory) {
        var mySocket = socketFactory();
        mySocket.forward('error');
        return mySocket;
    }

    socket.$inject = ['socketFactory'];

}());



