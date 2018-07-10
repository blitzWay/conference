(function () {
  'use strict';

  angular
    .module('app')
    .config(routerConfig);

  // routerConfig
  function routerConfig($stateProvider, $urlRouterProvider, $ionicConfigProvider, ionicDatePickerProvider) {

    $ionicConfigProvider.scrolling.jsScrolling(true);
    $ionicConfigProvider.tabs.position('bottom'); //tabs统一设置在底部
    //让nav标题在iOS和Android上都居中显示
    $ionicConfigProvider.navBar.alignTitle('center');
    $ionicConfigProvider.backButton.icon('ion-ios-arrow-back'); //返回按钮统一icon

    var datePickerObj = {
      inputDate: new Date(),
      titleLabel: '选择日期',
      setLabel: '确定',
      todayLabel: '今天',
      closeLabel: '关闭',
      mondayFirst: false,
      weeksList: ['日', '一', '二', '三', '四', '五', '六'],
      monthsList: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
      templateType: 'popup',
      from: new Date(2009, 1, 1),
      to: new Date(2058, 12, 31),
      showTodayButton: true,
      dateFormat: 'yyyy-MM-dd',
      closeOnSelect: false,
      disableWeekdays: []
    };
    ionicDatePickerProvider.configDatePicker(datePickerObj);


    $stateProvider
      .state('list', {
        url: '/list',
        cache: false,
        templateUrl: 'template/list.html',
        controller: 'ListController',
        controllerAs: 'vm'
      })
      .state('detail', {
        url: '/detail/:roomId',
        templateUrl: 'template/detail.html',
        controller: 'DetailController',
        controllerAs: 'vm'
      })
      .state('subscribe', {
        url: '/subscribe',
        cache: false,
        templateUrl: 'template/subscribe.html',
        controller: 'SubscribeController',
        controllerAs: 'vm'
      })
      .state('appointmentTime', {
        url: '/appointmentTime/:roomId/:roomName',
        cache: false,
        templateUrl: 'template/appointmentTime.html',
        controller: 'AppointmentTimeController',
        controllerAs: 'vm'
      })
      .state('chooseUsers', {
        url: '/chooseUsers/:flag/:id/:roomName/:loginName/:roomId/:dateValue/:reserveType',
        cache: false,
        templateUrl: 'template/chooseUsers.html',
        controller: 'ChooseUsersController',
        controllerAs: 'vm'
      })
      .state('chooseUsersDetail', {
        url: 'chooseUsersDetail',
        cache: false,
        templateUrl: 'template/chooseUsersDetail.html',
        controller: 'chooseUsersDetailController',
        controllerAs: 'vm'
      })
      .state('main', {
        url: '/main',
        cache: false,
        templateUrl: 'template/home.html',
        controller: 'MainController',
        controllerAs: 'vm'
      })
      .state('conferenceDetail', {
        url: '/conferenceDetail/:id/:mode',
        cache: false,
        templateUrl: 'template/conferenceDetail.html',
        controller: 'conferenceDetailController',
        controllerAs: 'vm'
      })
      .state('conferenceMore', {
        url: '/conferenceMore/:data',
        cache: false,
        templateUrl: 'template/conferenceMore.html',
        controller: 'conferenceMoreController',
        controllerAs: 'vm'
      })
      .state('history', {
        url: '/history',
        cache: false,
        templateUrl: 'template/history.html',
        controller: 'historyController',
        controllerAs: 'vm'
      });
    $urlRouterProvider.otherwise('/main');
  }
})();
