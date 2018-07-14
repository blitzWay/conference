(function () {
  'use strict';
  angular.module('app')
    .factory('publicService', publicService)
    .factory('getSSOticket', getSSOticket);

  // publicService
  function publicService($http, $ionicLoading, $rootScope, postURL, postAPI) {
    return {
      sendRequest: function (postMethod, bObj, callBack) {
        // $http({
        //     'url': postURL,
        //     'headers': {
        //         'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        //         'Accept': '*/*'
        //     },
        //     'method': 'POST',
        //     'data': {
        //         'req': [{
        //             'h': [{
        //                 'u.s': '?i=' + postAPI + '&m=' + postMethod
        //             }]
        //         }, {
        //             'b': [bObj]
        //         }]
        //     }
        // }).then(function (response) {
        //     //console.log('PostMethod：', postMethod, '\n Post param:', bObj, '\n Response:', response.data.res);
        //     callBack(response.data.res);
        // }, function (response) {
        //     console.log('失败的网络请求：', response);
        //     //alert('失败的网络请求：' + JSON.stringify(response));
        //     // 模态框
        //     $ionicLoading.show({
        //         template: '网络连接错误',
        //         noBackdrop: true,
        //         duration: 3000
        //     });
        // });

        // 假数据
        var url = '/js/json/' + postMethod + '.json';
        var base;
        if (!window.chrome) {
          base = 'http://10.30.1.231:8080/meeting-manager/conferenceOpenApi/';
        } else {
          base = 'http://121.196.221.153:8085/meeting-manager/conferenceOpenApi/';
        }


        var params = {};
        var method = 'GET';
        var userId = $rootScope.sso;
        bObj.userId = userId
        var callback = null
        var defaultCb = function (resp) {
          callBack(resp.data)
        }
        var headers = null

        switch (postMethod) {
          case 'getMySubscribe': {
            url = base + 'recentConferenceApplyList';
            params = bObj;
            method = 'POST';
            callback = defaultCb
            break;
          }
          case 'getRecentConferenceApplyList': {
            url = base + 'recentConferenceApplyList';
            params = bObj;
            method = 'POST';
            callback = defaultCb
            break;
          }
          case 'getRoomList': {
            url = base + 'reserveInfoByDay';
            params = bObj
            method = 'POST';
            callback = defaultCb
            break;
          }
          case 'conferenceList': {
            url = base + 'conferenceList';
            params = bObj
            method = 'POST';
            callback = defaultCb
            break;
          }
          case 'getRoomById': {
            url = base + 'boardroom';
            params = bObj
            method = 'POST';
            callback = defaultCb
            break;
          }

          case 'conference': {
            url = base + 'conference';
            params = bObj;
            method = 'POST';
            callback = defaultCb
            break;
          }
          case 'history': {
            url = base + 'conferenceApplyHistoryList';
            params = bObj;
            method = 'POST';
            callback = defaultCb
            break;
          }
          case 'apply': {
            url = base + 'saveOrUpdate';
            params = bObj;
            method = 'POST';
            callback = defaultCb;
            break;
          }
          case 'getOrgUserTree': {
            url = base + 'getOrgUserTree';
            method = 'GET';
            callback = defaultCb;
            break;
          }
          case 'checkSso': {
            url = base + 'checkSso';
            method = 'POST';
            params = {token: $rootScope.token};
            callback = defaultCb;
            break;
          }
        }
        console.log(url)
        $http({
          method: method,
          url: url,
          params: params,
          headers: headers
        }).then(function (response) {
          console.log(response);
          if(callback)callback(response)
          else callBack(response.data.res);
        }, function (response) {
          console.log('失败的网络请求：', response.headers());
          //alert('失败的网络请求：' + JSON.stringify(response));
          // 模态框
          $ionicLoading.show({
            template: '网络连接错误',
            noBackdrop: true,
            duration: 3000
          });
        });
        // over

      }
    };
  }

  // getSSOticket
  function getSSOticket($rootScope, $state, $ionicHistory, $location, publicService) {
    return {
      getTicket: function (callBack) {

        if(!window.chrome) {
          publicService.sendRequest('checkSso', {}, function(data){
            if (data.status) {
              console.log(data);
              $rootScope.sso = data.data.useruuid;
            }else {
              alert(JSON.stringify(data));
              alert(JSON.stringify(window.location.search));
              $rootScope.sso = '6ef1f325-13d1-49af-bc32-249f8966cd5d'
            }
            callBack()
          });
        } else {
          $rootScope.sso = '6ef1f325-13d1-49af-bc32-249f8966cd5d';
          callBack()
        }
        // alert(token)
      }
    };
  }

})();
