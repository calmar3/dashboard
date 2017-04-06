(function () {
  'use strict';

  var LampSettingsCtrl = ['$scope', '$rootScope', '$compile', function ($scope, $rootScope, $compile) {

    var ctrl = this;

      ctrl.entries = [10,50,100,200];

      ctrl.searchText="";

      ctrl.clicked = false;

      ctrl.show=10;

      ctrl.data =[];

      ctrl.possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

      ctrl.dates = ["25-12-2017","25-12-2016","25-12-2015","25-12-2014"];

      ctrl.streets = [ "Via dei Fori Imperiali" , "Via di San Giovanni in Laterano"];

      ctrl.pagingAction = pagingActionFn;

      ctrl.searchFilter = searchFilterFn;

      ctrl.selected = null;

      ctrl.select = selectFn;

      ctrl.shift = 0;

      ctrl.switchMode = switchModeFn;

      ctrl.validateForm = validateFormFn;

      ctrl.newLamp = { location:{
        gps_coordinate:{
        }
      }};

      function validateFormFn() {
          if (ctrl.newLamp.id && ctrl.newLamp.model && ctrl.newLamp.location.gps_coordinate.latitude
              && ctrl.newLamp.location.gps_coordinate.longitude)
              return true;
          return false;
      }

      function switchModeFn(mode) {
          ctrl.mode = mode;
          if (!mode){
              ctrl.selected = null;
              ctrl.newLamp = { location:{
                  gps_coordinate:{
                  }
              }};
          }

      }

      function selectFn(lamp) {
          ctrl.clicked = true;
          if (ctrl.selected === lamp)
            ctrl.selected = null;
          else if (ctrl.selected === null)
            ctrl.selected = lamp;
          else
            ctrl.selected = lamp;
      }

      $scope.$watch(function() {
          return ctrl.show;
      }, function(res) {
          ctrl.pagingAction(1,res);
      });



      function pagingActionFn( page, pageSize) {

          ctrl.shift = Math.floor(pageSize*(page-1));
          ctrl.dataset = JSON.parse(JSON.stringify(ctrl.data));
          ctrl.dataset = ctrl.dataset.splice(ctrl.shift,pageSize);
          ctrl.currentPage = page;
      }


      for (var i = 0 ; i<100; i++){
          var lamp = {location:{ gps_coordinate:{}}};
          lamp.id = i+1;
          lamp.model="";
          lamp.model += ctrl.possible.charAt(Math.floor(Math.random() * ctrl.possible.length));
          lamp.model += ctrl.possible.charAt(Math.floor(Math.random() * ctrl.possible.length));
          lamp.location.address = ctrl.streets[i%2];
          lamp.location.gps_coordinate.latitude = "10";
          lamp.location.gps_coordinate.longitude = "10";
          lamp.power_consumption = (Math.random()*100).toFixed(2);
          lamp.light_intensity = (Math.random()*100).toFixed(2);
          lamp.state_on = (i!== 0 && i !== 50 && i !==100);
          lamp.substitution_date = ctrl.dates[i%4];
          ctrl.data.push(lamp);
      }

      ctrl.dataset = ctrl.data.slice(0);


      function searchFilterFn(item) {

          if (ctrl.searchText && !ctrl.searchText !== '') {
              if (item.id.toString().toLowerCase().indexOf(ctrl.searchText.toLowerCase()) !== -1) {
                  return true;
              }
              else if (item.location.address.toLowerCase().indexOf(ctrl.searchText.toLowerCase()) !== -1) {
                  return true;
              }
              else if(item.model.toLowerCase().indexOf(ctrl.searchText.toLowerCase()) !== -1){
                  return true;
              }
              else {
                  return false;
              }
          }else{
              return true;
          }
      };


  }];

  LampSettingsCtrl.$inject = ['$scope', '$rootScope', '$compile'];

  angular.module('monitoringDashboardApp').controller('LampSettingsCtrl', LampSettingsCtrl);

}());
