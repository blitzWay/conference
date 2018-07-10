(function () {
  'use strict';

  angular
    .module('app')
    .controller('ListController', ListController);

  ListController.$inject = ['$scope', '$rootScope', 'ionicDatePicker', '$filter', 'getSSOticket', 'publicService', '$ionicLoading', '$sce', '$timeout', '$ionicPopup', '$state'];

  function ListController($scope, $rootScope, ionicDatePicker, $filter, getSSOticket, publicService, $ionicLoading, $sce, $timeout, $ionicPopup, $state) {
    var vm = this;
    vm.bookingButton = bookingButton;
    var date = new Date();
    vm.maxDate = new Date(date.setDate(date.getDate() + 90));
    vm.today = $filter('date')(new Date(), 'yyyy-MM-dd');
    vm.isDisabled = false;
    vm.changeDate = changeDate;
    vm.formatSrc = formatSrc;
    vm.closePage = closePage;
    vm.goBack = goBack;
    vm.init = init;
    vm.getRoomList = getRoomList;
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
      vm.changeDate();
      $scope.$on('$ionicView.afterEnter', function () {
        if ($rootScope.sso == undefined || $rootScope.sso == '') {
          getSSOticket.getTicket(function () {
            vm.getRoomList();
          });
        } else {
          vm.getRoomList();
        }
      });
    }

    /*
    * 立即预订按钮
    */
    function bookingButton(reserve) {
      var id = reserve.boardroomId
      var reserveType = reserve.reserveType
      var dateValue = $scope.dateValue
      var buttons = [{
        text: '上午',
        type: 'button-booking',
        onTap: function (e) {
          var sTime = dateValue + ' 8:00:00';
          var eTime = dateValue + ' 12:00:00';

          publicService.sendRequest('getRoomById', {boardroomId: id}, function (msg) {
            vm.isActive = false;
            if (msg.status) {
              vm.details = msg.data.boardroom;
              vm.details['coverImg.s'] = '//121.196.221.153:8085/' + msg.data.boardroomPic[0].thumbnailPath
              var roomName = vm.details['name'];
              vm.carousels = $sce.trustAsResourceUrl(vm.details['coverImg.s']);
              $state.go('chooseUsers', {
                sTime: sTime, eTime: eTime, flag: 1,
                roomName: roomName,
                loginName: vm.loginName,
                roomId: id,
                reserveType: '1',
                dateValue: dateValue
              });
            }
          });
        }
      }, {
        text: '下午',
        type: 'button-booking',
        onTap: function (e) {
          var sTime = $scope.dateValue + ' 12:00:00';
          var eTime = $scope.dateValue + ' 18:00:00';
          publicService.sendRequest('getRoomById', {boardroomId: id}, function (msg) {
            vm.isActive = false;
            if (msg.status) {
              vm.details = msg.data.boardroom;
              vm.details['coverImg.s'] = '//121.196.221.153:8085/' + msg.data.boardroomPic[0].thumbnailPath
              var roomName = vm.details['name'];
              vm.carousels = $sce.trustAsResourceUrl(vm.details['coverImg.s']);
              $state.go('chooseUsers', {
                sTime: sTime, eTime: eTime, flag: 1,
                roomName: roomName,
                loginName: vm.loginName,
                roomId: id,
                reserveType: '2',
                dateValue: dateValue
              });
            }
          });

        }
      }, {
        text: '全天',
        type: 'button-booking all-day',
        onTap: function (e) {
          var sTime = $scope.dateValue + ' 00:00:00';
          var eTime = $scope.dateValue + ' 24:00:00';
          //传递到后台 判断该会议室该时间是否被占用
          publicService.sendRequest('getRoomById', {boardroomId: id}, function (msg) {
            vm.isActive = false;
            if (msg.status) {
              vm.details = msg.data.boardroom;
              vm.details['coverImg.s'] = '//121.196.221.153:8085/' + msg.data.boardroomPic[0].thumbnailPath
              var roomName = vm.details['name'];
              vm.carousels = $sce.trustAsResourceUrl(vm.details['coverImg.s']);
              $state.go('chooseUsers', {
                sTime: sTime, eTime: eTime, flag: 1,
                roomName: roomName,
                loginName: vm.loginName,
                roomId: id,
                reserveType: '3',
                dateValue: dateValue
              });
            }
          });

        }
      }, {
        text: '取消',
        type: 'button-booking',
        onTap: function (e) {
          //取消暂时不需要任何处理
        }
      }];
      if (reserveType != 3) {
        if (!reserveType) {
        }else if(reserveType == 1) {
          buttons.splice(0,1)
          buttons.splice(1,1)
        }else if(reserveType == 2) {
          buttons.splice(1,2)
        }
      }
      var showPopup = $ionicPopup.show({
        title: '选择时间', // String. 弹窗的标题。
        template: '请选择你要预订的时间段?', // String (可选)。放在弹窗body内的html模板。
        buttons: buttons
      });
    }

    function formatSrc(src) {
      return $sce.trustAsResourceUrl(src);
    }

    //初始化时间组件
    function changeDate(dateFlag) {
      var startDateObj;
      if (dateFlag) {
        $scope.dateValue = $filter('date')(dateFlag, 'yyyy-MM-dd');
      } else {
        $scope.dateValue = vm.today;
      }
      startDateObj = {
        //选择日期后的回调
        callback: function (val) {
          $scope.dateValue = $filter('date')(val, 'yyyy-MM-dd');
          startDateObj.inputDate = new Date(val); //更新日期弹框上的日期
        },
        from: new Date(2010, 1, 1),
        to: vm.maxDate,
        inputDate: new Date($scope.dateValue),
        mondayFirst: true,
        closeOnSelect: false,
        dateFormat: 'yyyy-MM-dd',
        templateType: 'popup'
      };
      //打开开始日期选择框
      $scope.dateOpen = function () {
        ionicDatePicker.openDatePicker(startDateObj);
      };
    }

    $scope.yesterdayClick = function () {
      var yDate = new Date($scope.dateValue);//获取当前时间
      yDate.setDate(yDate.getDate() - 1);//设置天数 -1 天
      vm.isActive = true;
      vm.changeDate(yDate);
      vm.isDisabled = false;
      vm.startRows = 0;
      vm.pageSize = 5;
      vm.rowsCount = 1;
      vm.getRoomList();
    };
    $scope.tomorrowClick = function () {
      var tDate = new Date($scope.dateValue);//获取当前时间
      tDate.setDate(tDate.getDate() + 1);//设置天数 +1 天
      vm.isActive = true;
      vm.changeDate(tDate);
      if ($scope.dateValue == $filter('date')(vm.maxDate, 'yyyy-MM-dd')) {
        vm.isDisabled = true;
      }
      vm.startRows = 0;
      vm.pageSize = 5;
      vm.rowsCount = 1;
      vm.getRoomList();
    };

    //获取会议室列表
    function getRoomList() {
      var dataStr = {
        day: $scope.dateValue
      };
      publicService.sendRequest('getRoomList', dataStr, function (data) {
        console.log(data);
        vm.isActive = false;
        vm.code = data.status ? 0 : -1;
        if (vm.code == 0) {
          // 判断是否执行滚动加载
          if (data.data && data.data.length) {
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

    $scope.reserveRoom = function (id, reserveType) {

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
        day: $scope.dateValue
      };
      publicService.sendRequest('getRoomList', dataStr, function (data) {
        vm.code = 0;
        if (vm.code === 0) {
          vm.empty = undefined;
          if (vm.empty == undefined) {
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
      $state.go('main', {});
    }
  }
})();
