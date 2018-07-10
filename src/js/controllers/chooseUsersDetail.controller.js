(function () {
  'use strict';

  angular
    .module('app')
    .controller('chooseUsersDetailController', chooseUsersDetailController);

  chooseUsersDetailController.$inject = ['$scope', '$state', '$stateParams', '$rootScope', '$ionicLoading', 'publicService', '$ionicHistory'];

  function chooseUsersDetailController($scope, $state, $stateParams, $rootScope, $ionicLoading, publicService, $ionicHistory) {
    var vm = this;
    vm.goBack = goBack;
    vm.init = init;
    vm.chooseUsersDetail = chooseUsersDetail;
    vm.saveBtnClick = saveBtnClick;
    // vm.getDetail = getDetail;
    vm.dTitle = '选择人员';
    vm.memberNames = '';
    vm.memberIds = '';
    vm.memberLoginNames = '';
    vm.noticeSelect = '2';
    vm.isDetail = false; //判断false是选择页面 ,true是展示详情的页面
    vm.isActive = false;
    vm.users = []
    vm.init();

    function init() {
      publicService.sendRequest('getOrgUserTree', {},
        function (data) {
          var users = data.data
          vm.users = users.filter(function (node) {
            return node.nodeType === '3'
          })
          $rootScope.selected = {}
          vm.users.forEach(function(value){
            $rootScope.selected[value.id] = value
          })

          vm.selected = $rootScope.selected
        })

    }

    function chooseUsersDetail(userId) {
      vm.selected[userId].selected = !vm.selected[userId].selected
      return false;
    }

    function saveBtnClick() {
      if (vm.meetingTitle == undefined || vm.meetingTitle == '') {
        // 模态框
        $ionicLoading.show({
          template: '<span class="tips">请输入会议议题</span>',
          noBackdrop: true,
          duration: 2000
        });
        return;
      }
    }

    /*
     * 返回
     * flag 1表示预订时间跳转到这个页面，2表示壳子端消息，3表示从我的预订点击过来查看详情
     */
    function goBack() {
      $ionicHistory.goBack();
    }
  }
})();
