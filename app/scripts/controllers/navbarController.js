(function () {
  'use strict';

  var NavbarCtrl = ['$scope', '$rootScope', '$compile', '$state', '$stateParams', function ($scope, $rootScope, $compile, $state, $stateParams) {

    var ctrl = this;

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

    function goFn(location) {

      $state.go(location);

    }

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

  NavbarCtrl.$inject = ['$scope', '$rootScope', '$compile', '$state', '$stateParams'];

  angular.module('monitoringDashboardApp').controller('NavbarCtrl', NavbarCtrl);

} ());