(function () {
  'use strict';

  angular
    .module('app')
    .controller('conferenceDetailController', conferenceDetailController);

  conferenceDetailController.$inject = ['$scope', '$state',
    '$stateParams', '$rootScope', '$ionicLoading',
    'publicService', '$ionicHistory', '$filter'];

  function conferenceDetailController($scope, $state, $stateParams, $rootScope, $ionicLoading, publicService, $ionicHistory, $filter) {
    var vm = this;
    vm.goBack = goBack;
    vm.init = init;
    vm.getConferenceDetail = getConferenceDetail
    vm.toMore = toMore
    vm.conference = {}
    vm.isEdit = false
    vm.init()

    function init() {
      vm.getConferenceDetail($stateParams.id)

    }

    function getConferenceDetail(id) {
      publicService.sendRequest('conference',
        {id: id},
        function (resp) {
          vm.conference = resp.data
        })
    }
    function toMore(field) {
      var data, title;
      switch (field) {
        case 'file': {
          data = vm.conference.file;
          title = '会议文件';
          break;
        }
        case 'address': {
          data = vm.conference.info;
          title = '会议地址';
          break;
        }
        case 'notice': {
          title = '会议须知'
          break;
        }
        case 'members': {
          title = '参会人员'
          data = vm.conference.participants
          break;
        }
        case 'dinner': {
          title = '用餐信息'
          data = vm.conference.participants
          break;
        }
      }
      data = angular.toJson({field: field, title: title, data: data});
      $state.go('conferenceMore',{data: data});
    }

    function goBack() {
      $ionicHistory.goBack();
    }
  }
})();
