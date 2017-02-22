(function () {

  'use strict';

  angular.module('monitoringDashboardApp').config(routingConf).run(runfunction);

  routingConf.$inject = ['$stateProvider', '$urlRouterProvider'];

  runfunction.$inject = ['$rootScope'];

  function runfunction($rootScope) {
    $rootScope.$on('$stateChangeStart', function (event, toState, toStateParams) {
      $rootScope.toState = toState;
      $rootScope.toStateParams = toStateParams;
    });
  }


  function routingConf($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise("/");
    $stateProvider.state('site', {
      'abstract': true
    }).state('Home', {
      parent: 'site',
      url: '/',
      data: {
        roles: []
      },
      views: {
        'page@': {
          templateUrl: "views/main.html",
          controller: 'MainCtrl',
          controllerAs: 'ctrl'
        }
      },
      params: {
        home: true
      }
    }).state('Monitor', {
      parent: 'site',
      url: '/monitor',
      data: {
        roles: []
      },
      views: {
        'page@': {
          templateUrl: "views/monitor.html",
          controller: 'MonitorCtrl',
          controllerAs: 'ctrl'
        }
      },
      params: {
        home: true
      }
    }).state('Control', {
      parent: 'site',
      url: '/control',
      data: {
        roles: []
      },
      views: {
        'page@': {
          templateUrl: "views/control.html",
          controller: 'ControlCtrl',
          controllerAs: 'ctrl'
        }
      },
      params: {
        home: true
      }
    }).state('Lamps Settings', {
      parent: 'site',
      url: '/lampsettings',
      data: {
        roles: []
      },
      views: {
        'page@': {
          templateUrl: "views/lampsettings.html",
          controller: 'LampSettingsCtrl',
          controllerAs: 'ctrl'
        }
      },
      params: {
        home: true
      }
    });

  }

} ());
