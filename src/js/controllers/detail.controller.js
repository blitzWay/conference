(function () {
  'use strict';
  //会议室详情
  angular
    .module('app')
    .controller('DetailController', DetailController);

  DetailController.$inject = ['$scope', '$rootScope', '$stateParams', '$ionicLoading', '$sce', '$ionicModal', '$timeout', '$state', 'publicService'];

  function DetailController($scope, $rootScope, $stateParams, $ionicLoading, $sce, $ionicModal, $timeout, $state, publicService) {
    var vm = this;

    vm.init = init; // 初始化
    vm.getDatas = getDatas; // 加载数据
    vm.goBack = goBack; // 返回
    $rootScope.backStatus = 'detail';

    // 初始化
    vm.init();

    /*
     * 初始化函数
     * Author：dyp
     * Date:2017-9-26
     */
    function init() {
      // 调用获取数据
      vm.getDatas();
    }

    /*
     * 返回页面
     * Author:dyp
     * Date:2017-9-26
     */
    function goBack() {
      $state.go('list', {});
    }

    /*
     * 获取数据
     * Author：dyp
     * Date:2017-9-26
     */
    function getDatas() {
      var params = {
        boardroomId: $stateParams.roomId
      };
      publicService.sendRequest('getRoomById', params, function (data) {
        vm.isActive = false;
        vm.details = data.data.boardroom;
        vm.carousels = $sce.trustAsResourceUrl('//121.196.221.153/' + data.data.boardroomPic[0].relativePath);
      });
    }
  }
})();
