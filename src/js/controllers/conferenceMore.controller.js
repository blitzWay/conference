(function () {
  'use strict';

  angular
    .module('app')
    .controller('conferenceMoreController', conferenceMoreController);

  conferenceMoreController.$inject = ['$scope', '$state',
    '$stateParams', '$rootScope', '$ionicLoading',
    'publicService', '$ionicHistory', '$filter'];

  function conferenceMoreController($scope, $state, $stateParams, $rootScope, $ionicLoading, publicService, $ionicHistory, $filter) {
    var vm = this;
    vm.goBack = goBack;
    vm.init = init;
    vm.conference = {}
    vm.isEdit = false
    vm.init()
    vm.data = angular.fromJson($stateParams.data)

    function init() {
      console.log(vm.data)
    }


    function goBack() {
      $ionicHistory.goBack();
    }
  }
})();
