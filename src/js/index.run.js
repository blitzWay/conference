(function () {
	'use strict';

	angular
		.module('app')
		.run(init)
		.run(dateTimePicker);

	function init($rootScope) {
		if(navigator.platform == 'Win32' || navigator.platform == 'MacIntel') {
			//$rootScope.ssoTicket = 'edae750955d859f080c48b807cd21808'; //yun1游客
			//$rootScope.ssoTicket = 'bdc58edba2ddc4292d08729197b7e1ce'; //yun1
			// $rootScope.ssoTicket = '68a8749e4ce900dda838f1505181b3e4'; //
			// $rootScope.parkID = 'P001';
		}
    var query = decodeURIComponent(window.location.search.replace(/^\?/, ''))
    var token = query.match(/token=([a-z\d\-]+)/)[1]
		console.log(token)
		$rootScope.token = token
	}
	function dateTimePicker($ionicPickerI18n) {
		$ionicPickerI18n.weekdays = ['日', '一', '二', '三', '四', '五', '六'];
		$ionicPickerI18n.months = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];
		$ionicPickerI18n.ok = '确认';
		$ionicPickerI18n.cancel = '取消';
		$ionicPickerI18n.okClass = 'button-energized';
		$ionicPickerI18n.cancelClass = 'button-stable';
	}

	if (window.appnest === undefined) {
		window.appnest = {
			config: {
				getUserInfo: function(){}
			}
		}
	}
})();
