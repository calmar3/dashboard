'use strict';

/**
 * @ngdoc overview
 * @name monitoringDashboardApp
 * @description
 * # monitoringDashboardApp
 *
 * Main module of the application.
 */
angular
  .module('monitoringDashboardApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ngTouch',
    'ui.router',
    'angular-flot',
    'ngMap',
    'bw.paging',
      'ui.bootstrap',
      'btford.socket-io',
      'n3-pie-chart',
      'angular.morris'
  ]);
