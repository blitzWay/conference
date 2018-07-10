(function () {
  'use strict';

  angular
    .module('app')
    .controller('historyController', historyController);

  historyController.$inject = ['$scope', '$rootScope',
    'ionicDatePicker', '$filter',
    'getSSOticket', 'publicService',
    '$ionicLoading', '$sce', '$timeout',
    '$ionicPopup', '$state', '$ionicHistory'];

  function historyController($scope, $rootScope, ionicDatePicker,
                             $filter, getSSOticket,
                             publicService, $ionicLoading,
                             $sce, $timeout, $ionicPopup, $state,
                             $ionicHistory) {
    var vm = this;
    var date = new Date();
    vm.formatSrc = formatSrc;
    vm.closePage = closePage;
    vm.goBack = goBack;
    vm.init = init;
    vm.getHistoryList = getHistoryList;
    vm.pushRefresh = pushRefresh;
    vm.nextPage = nextPage;
    vm.init();
    $rootScope.backStatus = 'close';

    function init() {
      vm.startRows = 0;
      vm.pageSize = 5;
      vm.rowsCount = 1; // 滚动加载次数
      vm.listData = '';
      vm.listItem = '';
      vm.isActive = true;
      vm.disabled = true; // 滚动加载开关
      $scope.$on('$ionicView.afterEnter', function () {
        if ($rootScope.sso == undefined || $rootScope.sso == '') {
          getSSOticket.getTicket(function () {
            vm.getHistoryList();
          });
        } else {
          vm.getHistoryList();
        }
      });
    }


    function formatSrc(src) {
      return $sce.trustAsResourceUrl(src);
    }

    //获取会议室列表
    function getHistoryList() {
      var dataStr = {
        name: '',
        pageNum: 1,
        pageSize: 10
      };
      publicService.sendRequest('history', dataStr, function (data) {
        vm.isActive = false;
        vm.code = data.status ? 0 : -1;
        if (vm.code == 0) {
          // 判断是否执行滚动加载
          if (data.data && data.data.length) {
            vm.listData = data.data.shift(); //count
            vm.listItem = data.data;
            vm.count = 1;
            if (vm.count < vm.pageSize) {
              vm.disabled = false;
              if (vm.count == 0) {
                vm.dataTips = '';
              } else {
                vm.dataTips = '数据已全部加载完成';
              }
            } else {
              vm.disabled = true;
              vm.dataTips = '';
            }
          }
          $scope.$broadcast('scroll.refreshComplete');
        } else {
          // 模态框
          $ionicLoading.show({
            template: 'Sorry，数据加载出错！',
            noBackdrop: true,
            duration: 3000
          });
          $scope.$broadcast('scroll.refreshComplete');
        }
      });
    }

    //下拉刷新
    function pushRefresh() {
      $timeout(function () {
        vm.startRows = 0;
        vm.rowsCount = 1;
        // vm.isActive = true;
        vm.getRoomList();
      }, 50);
      vm.disabled = true;
    }

    // 滚动加载
    function nextPage() {
      var dataStr = {
        name: '',
        pageNum: vm.rowsCount,
        pageSize: vm.pageSize
      };
      publicService.sendRequest('history', dataStr, function (data) {
        vm.code = 0;
        if (vm.code === 0) {
          vm.empty = undefined;
          if (vm.empty == undefined) {
            vm.listData = data.data.shift(); //截取第一条数据
            vm.item = data.data;
            var len = vm.item.length;
            if (len > 0) {
              for (var i = 0; i < len; i++) {
                vm.listItem.push(vm.item[i]);
              }
              vm.rowsCount++;
            } else {
              vm.disabled = false;
              vm.dataTips = '数据已全部加载完成';
            }
          } else {
            vm.disabled = false;
            vm.dataTips = '数据已全部加载完成';
          }
          $scope.$broadcast('scroll.infiniteScrollComplete');
        } else {
          // 模态框
          $ionicLoading.show({
            template: 'Sorry，数据加载出错！',
            noBackdrop: true,
            duration: 3000
          });
          $scope.$broadcast('scroll.refreshComplete');
        }
      });
    }

    /*
     * 关闭轻应用
     */
    function closePage() {
      ns.runtime.closePage();
    }

    function goBack() {
      console.log('-1')
      window.history.go(-1)
    }
  }
})();
