(function() {
  'use strict';
  angular
    .module('app')
    .controller('MainController', MainController);

  MainController.$inject = ['$scope', '$rootScope', 'ionicDatePicker', '$filter', 'getSSOticket', 'publicService' , '$ionicLoading', '$sce', '$timeout', '$ionicPopup', '$state'];

  function MainController($scope, $rootScope, ionicDatePicker, $filter, getSSOticket,  publicService , $ionicLoading, $sce, $timeout,$ionicPopup, $state) {
    var vm = this;
    var date = new Date();
    vm.maxDate = new Date(date.setDate(date.getDate() + 90));
    vm.today = $filter('date')(new Date(), 'yyyy-MM-dd');
    vm.isDisabled = false;
    vm.formatSrc = formatSrc;
    vm.closePage = closePage;
    vm.init = init;
    vm.getList = getList;
    vm.pushRefresh = pushRefresh;
    vm.nextPage = nextPage;
    vm.init();
    vm.script='';
    vm.runScript = runScript;
    $rootScope.backStatus = 'close';
    vm.currentTab = $rootScope.homeTab;
    vm.switchTab = switchTab;
    var typeMap = {
      'latest': 'getRecentConferenceApplyList',
      'history': 'history',
      'subscribe': 'conferenceList'
    };
    function init() {
      vm.pageNum = 1;
      vm.pageSize = 10;
      vm.rowsCount = 1; // 滚动加载次数
      // vm.listData = '';
      // vm.listItem = '';
      vm.isActive = true;
      vm.disabled = false; // 滚动加载开关

      vm.username = '';
      vm.token = $rootScope.sso;
      if(!$rootScope.homeTab){
        vm.currentTab = $rootScope.homeTab = 'latest';
      } else {
        vm.currentTab = $rootScope.homeTab;
      }

      $scope.$on('$ionicView.afterEnter', function(){
        if ($rootScope.sso == undefined || $rootScope.sso == '' ) {
          getSSOticket.getTicket(function () {
            vm.getList();
          });
        } else {
          vm.getList();
        }
      });
    }
    function formatSrc(src) {
      return $sce.trustAsResourceUrl(src);
    }
    function runScript() {
      var ret = eval(vm.script)
      alert(ret)
    }

    //获取会议室列表
    function getList() {
      vm.isActive = true;
      var dataStr = {
        'userId': $scope.dateValue,
        // 'orderBy': vm.startRows,
        'pageNum': vm.pageNum,
        pageSize: vm.pageSize
      };

      publicService.sendRequest(typeMap[vm.currentTab], dataStr, function(data) {
        var list = [];
        var count = 0;
        vm.code = data.status?0:-1;
        vm.isActive = false;
        if (vm.code === 0) {
          // 判断是否执行滚动加载
          switch(vm.currentTab) {
            case 'latest': {
              list = data.data.datas;
              count = data.data.datas.length;
              break;
            }
            case 'history': {
              list = data.data;
              count = data.data.length;
              break;
            }
            case 'subscribe': {
              list = data.data;
              count = data.data.length;
              break;
            }
          }
          if (list && list.length) {
            vm.listItem = list;
            vm.count = data.data.count;
            console.log(vm.listData,vm.listItem)
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
      $timeout(function() {
        vm.startRows = 0;
        vm.rowsCount = 1;
        vm.isActive = true;
        vm.pageNum = 1;
        vm.getList();
      }, 50);
      vm.disabled = true;
    }

    // 滚动加载
    function nextPage() {
      var dataStr = {
        'userId': $scope.dateValue,
        // 'orderBy': vm.startRows,
        'pageNum': ++vm.pageNum,
        pageSize: vm.pageSize
      };

      publicService.sendRequest(typeMap[vm.currentTab], dataStr, function(data) {
        var list, count;
        vm.code = data.status?0:-1;
        if (vm.code == 0) {
          switch(vm.currentTab) {
            case 'latest': {
              list = data.data.datas;
              count = data.data.datas.length;
              break;
            }
            case 'history': {
              list = data.data;
              count = data.data.length;
              break;
            }
            case 'subscribe': {
              list = data.data;
              count = data.data.length;
              break;
            }
          }
          vm.empty = list.length;
          if (vm.empty) {
            vm.item = list;
            var len = vm.item.length;
            if (len > 0) {
              for (var i = 0; i < len; i++) {
                vm.listItem.push(vm.item[i]);
              }
              vm.rowsCount ++;
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


    function switchTab(tabName){
      $rootScope.homeTab = vm.currentTab = tabName;
      vm.pageNum = 1;
      vm.listItem = [];
      vm.getList();
    }
    /*
     * 关闭轻应用
     */
    function closePage() {
      var vConsole = new VConsole();
      if(window.appnest){
        window.appnest.navigation.closeWindow();
      }
    }
  }
})();
