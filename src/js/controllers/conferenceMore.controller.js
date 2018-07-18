(function () {
  'use strict';

  angular
    .module('app')
    .controller('conferenceMoreController', conferenceMoreController);

  conferenceMoreController.$inject = ['$scope', '$state',
    '$stateParams', '$rootScope', '$ionicLoading',
    'publicService', '$ionicHistory', '$filter'];

  function conferenceMoreController($scope, $state, $stateParams, $rootScope, $ionicLoading, publicService, $ionicHistory, $filter) {
    var vm = this;
    vm.goBack = goBack;
    vm.init = init;
    vm.conference = {}
    vm.isEdit = false
    vm.downloadFile = downloadFile;
    vm.init()
    vm.data = angular.fromJson($stateParams.data)

    function init() {
      console.log(vm.data)
    }


    function goBack() {
      window.history.go(-1);
    }
    function downloadFile(filePath, fileName) {
      // window.location = 'http://10.30.1.231:8080' + filePath;
      appnest.http.download({
        url: 'http://10.30.1.231:8080' + filePath,
        path: 'res:/download_file/',
        fileName: fileName,
        isBlock: true,
        success: function (resp) {
          var path = resp.path;
          console.log(arguments, 'success');
          appnest.native.openFile({
            path: path
          });
        },
        responseProgress: function () { console.log(arguments, 'responseProgress') },
        ret: function () { console.log(arguments, 'ret') },
        fail: function () {
          console.log(arguments, 'fail');
          $ionicLoading.show({
            template: 'Sorry，文件下载失败！',
            noBackdrop: true,
            duration: 2000
          });
        }
      })
      appnest.webview.openUrl({url: 'http://10.30.1.231:8080' + filePath})
    }
  }
})();
