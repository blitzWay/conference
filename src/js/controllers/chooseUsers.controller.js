(function () {
  'use strict';

  angular
    .module('app')
    .controller('ChooseUsersController', ChooseUsersController);

  ChooseUsersController.$inject = ['$scope', '$state', '$stateParams', '$rootScope', '$ionicLoading', 'publicService', '$ionicHistory'];

  function ChooseUsersController($scope, $state, $stateParams, $rootScope, $ionicLoading, publicService, $ionicHistory) {
    var vm = this;
    vm.goBack = goBack;
    vm.init = init;
    vm.chooseUsers = chooseUsers;
    vm.chooseLeaders = chooseLeaders;
    vm.saveBtnClick = saveBtnClick;
    vm.getDetail = getDetail;
    vm.dTitle = '选择人员';
    vm.memberNames = '';
    vm.memberIds = '';
    vm.memberLoginNames = '';
    vm.noticeSelect = '2';
    vm.isDetail = true; //判断false是选择页面 ,true是展示详情的页面
    vm.isActive = true;
    vm.selected = $rootScope.selected;
    vm.selectedLeaders = $rootScope.selectedLeaders;
    $rootScope.backStatus = 'detail';
    vm.init();

    function init() {
      var sta = ['', '08:00', '12:00', '00:00']
      var stb = ['', '12:00', '18:00', '24:00']
      var reservTypes = ['', '上午', '下午', '全天']
      $stateParams.sTime = $stateParams.dateValue + ' ' + sta[$stateParams.reserveType];
      $stateParams.eTime = $stateParams.dateValue + ' ' + stb[$stateParams.reserveType];
      var all_user = localStorage.getItem('names');
      vm.memberNames = all_user;
      vm.flag = $stateParams.flag;
      if (vm.flag == 1) {
        //正常点击预订选择完人员后 点击保存显示数据
        // vm.meetingTime = $stateParams.sTime + '至' + $stateParams.eTime;
        vm.meetingTime = $stateParams.dateValue + ' ' + reservTypes[$stateParams.reserveType];
        vm.dateValue = $stateParams.dateValue;
        vm.reserveType = $stateParams.reserveType;
        vm.loginName = $stateParams.loginName;
        vm.roomName = $stateParams.roomName;
        vm.roomId = $stateParams.roomId;
        vm.roomId = $stateParams.roomId;
        vm.isActive = false;
      } else {
        //从壳子端跳转过来 或者从我的预订跳转过来的
        vm.subId = $stateParams.id;
        if (vm.flag == 2) {
          $rootScope.backType = 'push';
        }
        //根据id查询数据并展示
        $scope.$on('$ionicView.afterEnter', function () {
          vm.getDetail();
        });
      }
      console.log($rootScope.tempConference)
      if ($rootScope.tempConference) {
        vm.meetingTitle = $rootScope.tempConference.name;
        vm.content = $rootScope.tempConference.content;
        $rootScope.tempConference = null;
      }
    }

    function getDetail() {
      var params = {
        'ssoTicket.s': $rootScope.sso,
        'id.s': vm.subId
      };
      vm.isDetail = false;
      vm.dTitle = '预订详情';
      publicService.sendRequest('getRoomById', params, function (msg) {
        if (msg[0].h[0]['code.i'] == 0) {
          vm.details = msg[1].b[0].roomSub[0];
          vm.roomName = vm.details['roomName.s'];
          vm.loginName = vm.details['loginName.s'];
          vm.meetingTime = vm.details['timeSlot.s'];
          vm.meetingTitle = vm.details['purpose.s'];
          vm.memberNames = vm.details['memberNames.s'];
          vm.isActive = false;
        }
      });
    }

    function chooseLeaders() {
      $rootScope.tempConference = {
        name: vm.meetingTitle,
        content: vm.content
      };
      $state.go('chooseUsersDetail', {flag: 4});
      // console.log('fd');
      vm.flag = 4;
      return false;
    }

    function chooseUsers() {
      $rootScope.tempConference = {
        name: vm.meetingTitle,
        content: vm.content
      };
      // $state.go('chooseUsersDetail', {flag: 4});
      // console.log('fd');
      var selected;
      if(vm.selected) {
        selected = vm.selected.map(function(user){return user.userUuid})
      }
      appnest.contact.selectMembersUI({
        imAccounts: selected,
        success: function (res) {
          var memberInfos= res.memberInfos; // 返回成员数组
          $scope.$apply(function () {
            vm.selected = memberInfos
            console.log(vm.selected)
          });
        },
        fail: function (res) {
          alert(res.errMsg);
        }
      });
      vm.flag = 4;
      return false;


      var list = [], i;
      // ns.runtime.contact({
      //   'onSuccess': function (msg) {
      //     list = msg.obj;
      //     if (list.length <= 0) {
      //       return false;
      //     }
      //     vm.memberNames = '';
      //     vm.memberIds = '';
      //     vm.memberLoginNames = '';
      //     for (i = 0; i < list.length; i += 1) {
      //       if ((i + 1) == list.length) {
      //         vm.memberNames += list[i]['user'].realName;
      //         vm.memberLoginNames += list[i]['user'].userName;
      //         vm.memberIds += list[i]['userAgencyJobs'][0]['userId'];
      //       } else {
      //         vm.memberNames += list[i]['user'].realName + '、';
      //         vm.memberLoginNames += list[i]['user'].userName + ',';
      //         vm.memberIds += list[i]['userAgencyJobs'][0]['userId'] + ',';
      //       }
      //     }
      //     //处理返回后无法自动刷新立刻显示的问题
      //     setTimeout(function () {
      //       $scope.$apply(function () {
      //         vm.memberNames = vm.memberNames;
      //       });
      //     }, 200);
      //   },
      //   'onFail': function (msg) {
      //     $ionicLoading.show({
      //       template: '<span class="tips">人员选择打开失败</span>',
      //       noBackdrop: true,
      //       duration: 2000
      //     });
      //   }
      // });
    }

    function saveBtnClick() {
      var participants = ''
      var leaders = '';
      console.log(vm.selected)
      if(vm.selected){
        vm.selected.forEach(function(user){
          participants = participants + user.userUuid + ','
        })
      }
      var ln;
      if(vm.selectedLeaders){
        ln = Object.keys(vm.selectedLeaders);
        ln.forEach(function(user){
          leaders = leaders + vm.selectedLeaders[user].id + ','
        })
      }

      var params = {
        name: vm.meetingTitle,
        content: vm.content,
        agenda: vm.agenda,
        boardroomId: vm.roomId,
        meetingType: '1',
        participants: participants.replace(/,$/, ''),
        leaders: leaders.replace(/,$/, ''),
        fileIds: '',
        reserveInfo: vm.dateValue + '_' + vm.reserveType
      };

      if (vm.meetingTitle == undefined || vm.meetingTitle == '') {
        // 模态框
        $ionicLoading.show({
          template: '<span class="tips">请输入会议议题</span>',
          noBackdrop: true,
          duration: 2000
        });
        return;
      }
      publicService.sendRequest('apply', params, function (msg) {
        var code = msg.status ? 0 : -1;
        if (code == 0) {
          vm.result = msg.data;
          if (vm.result) {
            vm.isDetail = false;
            vm.dTitle = '预约详情';
            //保存成功后返回list页面
            vm.flag = 2;
            $ionicLoading.show({
              template: '<span class="tips">预约成功</span>',
              noBackdrop: true,
              duration: 2000
            });
            setTimeout(function(){
              window.history.go(-1)
            }, 2000)
          } else {
            $ionicLoading.show({
              template: '<span class="tips">预约失败</span>',
              noBackdrop: true,
              duration: 2000
            });
            vm.isDetail = true;
            vm.dTitle = '选择人员';
          }
          $rootScope.selected = {};
        } else {
          $ionicLoading.show({
            template: '<span class="tips">预约失败，' + msg.msg + '</span>',
            noBackdrop: true,
            duration: 2000
          });
        }
      });
    }

    /*
     * 返回
     * flag 1表示预订时间跳转到这个页面，2表示壳子端消息，3表示从我的预订点击过来查看详情
     */
    function goBack() {
      window.history.back()
      $rootScope.selected = null
      // if (vm.flag == 1) {
      //   $ionicHistory.goBack();
      // } else if (vm.flag == 2) {
      //   //点击壳子的消息跳转过来直接返回 列表页面
      //   ns.runtime.closePage();
      //   // $state.go('list', {});
      // } else if (vm.flag == 3) {
      //   //返回我的预订页面
      //   $ionicHistory.goBack();
      // }
    }
  }
})();
