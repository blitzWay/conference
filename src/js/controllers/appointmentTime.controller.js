(function() {
    'use strict';

    angular
        .module('app')
        .controller('AppointmentTimeController', AppointmentTimeController);

    AppointmentTimeController.$inject = ['$stateParams', '$state', '$rootScope', '$ionicLoading', 'publicService', '$ionicHistory', '$ionicPopup'];

    function AppointmentTimeController($stateParams, $state, $rootScope, $ionicLoading, publicService, $ionicHistory, $ionicPopup) {
        var vm = this;
        vm.goBack = goBack;
        vm.goNext = goNext;
        $rootScope.backStatus = 'detail';
        vm.init = init;
        vm.init();
        function init() {
            var date = new Date();
            vm.minDate = new Date(date.setDate(date.getDate() - 1));
        }
        //跳转到选择人员页面并验证时间是否已经被预约
        function goNext () {
            var sTime = document.getElementById('sDateTime').innerHTML,
                eTime = document.getElementById('eDateTime').innerHTML,
                startDate = sTime.replace(/-/g, '/'),
                endDate = eTime.replace(/-/g, '/');
            if (sTime == '') {
                $ionicLoading.show({
                    template: '<span class="tips">' + '请选择开始时间。</span>',
                    noBackdrop: true,
                    duration: 2000
                });
            } else if(eTime == '') {
                $ionicLoading.show({
                    template: '<span class="tips">' + '请选择结束时间。</span>',
                    noBackdrop: true,
                    duration: 2000
                });
            } else if ((Date.parse (endDate) - Date.parse (startDate)) <= 0) {
                $ionicLoading.show({
                    template: '<span class="tips">' + '结束时间必须大于开始时间。</span>',
                    noBackdrop: true,
                    duration: 2000
                });
            } else {
                //传递到后台 判断该会议室该时间是否被占用
                var params = {
                    'ssoTicket.s': $rootScope.sso,
                    'roomId.s': $stateParams.roomId,
                    'startTime.s': sTime,
                    'endTime.s': eTime
                };
                console.log(params);
                publicService.sendRequest('checkTimeSlot', params, function(msg) {
                    if (msg[0].h[0]['code.i'] == 0) {
                        vm.result = msg[1].b[0].result[0]['result.b'];
                        if (vm.result == 0) {
                            vm.loginName = msg[1].b[0].result[0]['loginName.s'];
                            $state.go('chooseUsers', {sTime: sTime, eTime: eTime, flag : 1, roomName: $stateParams.roomName, loginName: vm.loginName, roomId: $stateParams.roomId });

                        } else {
                            var showPopup = $ionicPopup.alert({
                                title: '预订重复', // String. 弹窗的标题。
                                template: '预订时间内该会议室有预订请重新选择时间!',
                                okText: '确定'
                            });
                        }
                    }
                });
            }
        }
        /*
         * 返回
         */
        function goBack() {
            $ionicHistory.goBack();
        }
    }
})();
