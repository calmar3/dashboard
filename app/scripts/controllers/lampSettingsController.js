(function () {
  'use strict';

  var LampSettingsCtrl = ['$scope', '$rootScope', '$compile','$http','dataFactory', function ($scope, $rootScope, $compile,$http,dataFactory) {

    var ctrl = this;

      ctrl.entries = [10,50,100,200];

      ctrl.searchText="";

      ctrl.clicked = false;

      ctrl.show=10;

      ctrl.data = dataFactory.getLampList();

      ctrl.pagingAction = pagingActionFn;

      ctrl.searchFilter = searchFilterFn;

      ctrl.selected = null;

      ctrl.select = selectFn;

      ctrl.shift = 0;

      ctrl.switchMode = switchModeFn;

      ctrl.validateForm = validateFormFn;

      ctrl.newLamp = {};

      ctrl.deleteLamp = deleteLampFn;

      ctrl.insertLamp = insertLampFn;

      loadData();

      function deleteLampFn() {
          $http.delete(dataFactory.getHost()+'/api/lamp/'+ctrl.selected.lampId).then(function (response) {

              loadData();
              loadData();
              ctrl.done = true;
              setTimeout(function () {
                  ctrl.done = null;
                  ctrl.switchMode();
              },500);

          }).catch(function (error) {
              console.log(error);
              ctrl.updateError = true;
              setTimeout(function () {
                  ctrl.updateError = null;
                  ctrl.switchMode();
              },500);
          });
      }

      function insertLampFn() {

          if (!ctrl.validateForm()){
              ctrl.formError = true;
              setTimeout(function () {
                  ctrl.formError = null;
              },500);
              return;
          }
          ctrl.newLamp.consumption = 0;
          ctrl.newLamp.lightIntensity = 0;
          ctrl.newLamp.stateOn = true;
          ctrl.newLamp.timestamp = 0;
          $http.post(dataFactory.getHost()+'/api/lamp',ctrl.newLamp).then(function (response) {

              loadData();
              ctrl.done = true;
              setTimeout(function () {
                  ctrl.done = null;
                  ctrl.switchMode();
              },500);


          }).catch(function (error) {
              console.log(error);
              ctrl.updateError = true;
              setTimeout(function () {
                  ctrl.updateError = null;
                  ctrl.switchMode();
              },500);
          });

      }

      function loadData() {
          $http.get(dataFactory.getHost()+'/api/lamps').then(function (response) {

              if (JSON.stringify(ctrl.data) !== JSON.stringify(response.data.lamps)){
                  ctrl.data = response.data.lamps;
              }
              ctrl.dataset = ctrl.data.slice(0);
          }).catch(function (error) {
              console.log(error);
          });
      }


      function validateFormFn() {

          if (isNaN(parseInt(ctrl.newLamp.lampId)))
              return false;

          for (var i = 0 ; i < ctrl.data.length ; i++){
              if (parseInt(ctrl.newLamp.lampId) === parseInt(ctrl.data[i].lampId)){
                  return false;
              }
          }
          if (ctrl.newLamp.lampId && ctrl.newLamp.model && ctrl.newLamp.latitude
              && ctrl.newLamp.longitude && ctrl.newLamp.address && ctrl.newLamp.city && ctrl.newLamp.lastSubstitutionDate
          && ctrl.newLamp.cellId){

              return true;
          }

          return false;
      }

      function switchModeFn(mode) {
          ctrl.mode = mode;
          if (!mode){
              ctrl.selected = null;
              ctrl.newLamp = {};
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

  LampSettingsCtrl.$inject = ['$scope', '$rootScope', '$compile','$http','dataFactory'];

  angular.module('monitoringDashboardApp').controller('LampSettingsCtrl', LampSettingsCtrl);

}());
