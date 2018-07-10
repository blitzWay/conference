(function() {
    'use strict';

	angular.module('app')
		.filter('dateTimeFormat', function() {
			return function(input) {
				var dateTime = '';

				if(input != undefined) {
					var dateTime = input.split(' ');
					dateTime.pop();
	//				newDateTime = dateTime.join(':');
				}
				return dateTime.toString();
			};
		})
		.filter('tagFormat', function() {
			return function(input) {
				var tag = '',
					newTag = '';

				if(input != undefined) {
					tag = input.split(',');
					newTag = tag.join('，');
				}
				return newTag;
			};
		})
		.filter('subStringTitle', function() {
			return function(title) {
				var str = '';
				if (title.toString().length > 10) {
					str = title.toString().substring(0, 10) + '...';
				} else {
					str = title;
				}
				return str;
			};
		})
        .filter ('subStrMeetingTitle', function () {
            return function(title) {
				var str = '';
				if (title.toString().length > 18) {
					str = title.toString().substring(0, 18) + '...';
				} else {
					str = title;
				}
				return str;
            };
        })
        .filter('imgpop', function() {
            return function(src) {
                var imgArr = JSON.parse(src);

                return imgArr[0];
            };
        })
        .filter('dateTimePop', function() {
            return function(date) {
                var str = date.split(' ').pop();
                var newstr = str.substring(0, str.length - 3);
                return newstr;
            };
        })
        .filter('timePop', function() {
            return function(date) {
                var str = date;
                var newstr = str.toString().substring(0, str.length - 3);
                return newstr;
            };
        });
})();