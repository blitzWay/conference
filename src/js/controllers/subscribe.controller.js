(function() {
    'use strict';

    angular
        .module('app')
        .controller('SubscribeController', SubscribeController);

    SubscribeController.$inject = ['$scope', '$state', '$timeout', '$stateParams', '$rootScope', '$ionicPopup', '$ionicLoading', 'publicService', '$sce'];

    function SubscribeController($scope, $state, $timeout , $stateParams, $rootScope, $ionicPopup, $ionicLoading, publicService, $sce) {
        var vm = this;
        vm.applyCancel = applyCancel;
        vm.goBack = goBack; // 返回上一页

        vm.init = init; // 初始化
        vm.getDatas = getDatas; // 加载数据
        vm.doRefresh = doRefresh; // 下拉刷新
        vm.loadMore = loadMore; // 上拉加载
        vm.formatSrc = formatSrc;
        // 初始化
        vm.init();

        function init() {
            vm.disabled = false; // 滚动加载开关
            vm.startRows = 0; // 数据起始值
            vm.rowsCount = 1; // 滚动加载次数
            vm.pageSize = 50; // 每页加载大小
            vm.isActive = true; // 数据加载loading是否显示

            // 调用获取数据
            $scope.$on('$ionicView.afterEnter', function(){
                vm.getDatas();
            });

          // appnest.config.getUserInfo({
          //   success: function (res) {
          //     vm.username= res.userName; // 用户名
          //     vm.password= res.password;//用户密码
          //     vm.token= res.loginId;//用户标识
          //     vm.imAccount= res.imAccount;//用户 IM 账号
          //     vm.photoUrl = res.photoUrl; //用户头像地址
          //   },
          //   fail: function (res) {
          //     alert(res.errMsg);
          //   }
          // });
        }

        function formatSrc(src) {
            return $sce.trustAsResourceUrl(src);
        }
        function getDatas() {
            vm.params = {orderBy: 1, pageNum: 0, pageSize: 50};

            publicService.sendRequest('getMySubscribe', vm.params, function(msg) {
                console.log(msg);
                vm.code = msg.status ? 0 : -1;
                if (vm.code === 0) {
                    // 判断是否执行滚动加载
                    vm.lists = msg.data.datas;
                    vm.count = msg.data.count;
                    vm.isActive = false;
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
                } else {
                    // 模态框
                    $ionicLoading.show({
                        template: 'Sorry，数据加载出错！',
                        noBackdrop: true,
                        duration: 2000
                    });
                }
            });
        }

        function doRefresh() {
            $timeout(function() {
                vm.startRows = 0;
                vm.rowsCount = 1;
                vm.getDatas();
            }, 100);
            vm.disabled = true;
            $scope.$broadcast('scroll.refreshComplete');
        }

        function loadMore() {
            var params = {
                'ssoTicket.s': $rootScope.sso,
                'startRows.i': vm.rowsCount * vm.pageSize,
                'pageSize.i': vm.pageSize
            };
            publicService.sendRequest('getMySubscribe', params, function(msg) {
                vm.code = msg[0]['h'][0]['code.i'];
                if (vm.code == 0) {
                    vm.empty = msg[1].b[0]['value.s'];
                    if (vm.empty == undefined) {
                        if(msg[1].b[0].roomSubList == undefined) {
                            vm.disabled = false;
                            vm.dataTips = '数据已全部加载完成';
                        } else {
                            vm.listData = msg[1].b[0]['roomSubList'].shift();
                            var item = msg[1].b[0]['roomSubList'], len = item.length;
                            if (len > 0) {
                                for (var i = 0; i < len; i++) {
                                    vm.lists.push(item[i]);
                                }
                                vm.rowsCount++;
                            } else {
                                vm.disabled = false;
                                vm.dataTips = '数据已全部加载完成';
                            }
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
                        duration: 2000
                    });
                    $scope.$broadcast('scroll.refreshComplete');
                }
            });
        }

        /*
        * 取消会议室申请
        */
        function applyCancel(id) {
            var showPopup = $ionicPopup.show({
                title: '取消预订', // String. 弹窗的标题。
                template: '您的预订已经通知相关联系人是否取消预订?', // String (可选)。放在弹窗body内的html模板。
                buttons: [{
                    text: '确定',
                    type: 'button-ok',
                    onTap: function(e) {
                        $scope.cannelRequest = {
                            'ssoTicket.s': $rootScope.sso,
                            'id.s': id
                        };
                        publicService.sendRequest('cannel', $scope.cannelRequest, function(msg) {
                            $ionicLoading.hide();
                            $scope.showLoading = false;
                            if (msg[0].h[0]['code.i'] == 0) {
                                vm.doRefresh();
                                $ionicLoading.show({
                                    noBackdrop: true,
                                    template: '<span class="tips">' + '取消预订成功!</span>',
                                    duration: 2000
                                });
                            }
                        });
                    }
                }, {
                    text: '取消',
                    type: 'button-cancel',
                    onTap: function(e) {
                        //取消暂时不需要任何处理
                    }
                }]
            });
        }
        /*
         * 返回上一页
         */
        function goBack() {
            window.history.go(-1)
        }
    }
})();
