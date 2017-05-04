/**
 * controller related to lampsettings.html
 * Contains data to show in this view
 */
(function () {
  'use strict';

  var LampSettingsCtrl = ['$scope', '$rootScope', '$compile','$http','dataFactory', function ($scope, $rootScope, $compile,$http,dataFactory) {

    var ctrl = this;

      ctrl.entries = [10,50,100,200];

      ctrl.searchText="";

      ctrl.clicked = false;

      ctrl.show=10;

      ctrl.data = dataFactory.getLampList();

      ctrl.dataset = ctrl.data.slice(0);

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

      ctrl.lastSubstitutionDateShow = null;

      ctrl.currentPage = 1;

      /**
       * REST API to delete lamp
       */
      function deleteLampFn() {

          $http.delete(dataFactory.getHost()+'/api/lamp/'+ctrl.selected.lampId).then(function (response) {

              loadData();
              loadData();
              ctrl.done = true;
              setTimeout(function () {
                  console.log("all ok");
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

      /**
       * REST API to insert new lamp
       */
      function insertLampFn() {

          if (!ctrl.validateForm()){
              ctrl.formError = true;
              setTimeout(function () {
                  ctrl.formError = null;
              },500);
              return;
          }
          var str1 = ctrl.lastSubstitutionDateShow;
          var dt1   = parseInt(str1.substring(0,2));
          var mon1  = parseInt(str1.substring(3,5));
          var yr1   = parseInt(str1.substring(6,10));
          var date1 = new Date(yr1, mon1-1, dt1);
          var d = date1.getTime();
          ctrl.newLamp.lastSubstitutionDate = d;
          ctrl.newLamp.consumption = 0;
          ctrl.newLamp.lightIntensity = 0;
          ctrl.newLamp.stateOn = true;
          ctrl.newLamp.timestamp = 0;
          ctrl.newLamp.residualLifeTime = 0;
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


      function validateFormFn() {

          if (isNaN(parseInt(ctrl.newLamp.lampId)))
              return false;

          for (var i = 0 ; i < ctrl.data.length ; i++){
              if (parseInt(ctrl.newLamp.lampId) === parseInt(ctrl.data[i].lampId)){
                  return false;
              }
          }
          if (ctrl.newLamp.lampId && ctrl.newLamp.model && ctrl.newLamp.latitude
              && ctrl.newLamp.longitude && ctrl.newLamp.address && ctrl.newLamp.city && ctrl.lastSubstitutionDateShow){

              return true;
          }

          return false;
      }

      function switchModeFn(mode) {
          ctrl.mode = mode;
          if (!mode){
              ctrl.selected = null;
              ctrl.newLamp = {};
              ctrl.lastSubstitutionDateShow = null;
          }
          ctrl.pagingAction(1,ctrl.show);
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


      /**
       * watch show variable changes to update the table layout with pagination
       */
      $scope.$watch(function() {
          return ctrl.show;
      }, function(res) {
          ctrl.pagingAction(1,res);
      });

      /**
       * watch lamplist changes to update right ctrl variable
       */
      $scope.$watch(function() {
          return dataFactory.lampList;
      }, function(res) {
          ctrl.data = dataFactory.getLampList().slice(0);
          pagingActionFn(ctrl.currentPage,ctrl.show);
      });



      function pagingActionFn( page, pageSize) {

          ctrl.shift = Math.floor(pageSize*(page-1));
          ctrl.dataset = JSON.parse(JSON.stringify(ctrl.data));
          ctrl.dataset = ctrl.dataset.splice(ctrl.shift,pageSize);
          ctrl.currentPage = page;
      }


      function searchFilterFn(item) {

          if (ctrl.searchText && !ctrl.searchText !== '') {
              if (item.lampId.toString().toLowerCase().indexOf(ctrl.searchText.toLowerCase()) !== -1) {
                  return true;
              }
              else if (item.address.toLowerCase().indexOf(ctrl.searchText.toLowerCase()) !== -1) {
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
