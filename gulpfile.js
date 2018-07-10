var gulp = require('gulp'),
	wrench = require('wrench');

// 引入打包JS模块
wrench.readdirSyncRecursive('./gulp').filter(function(file) {
  return (/\.(js|coffee)$/i).test(file);
}).map(function(file) {
  require('./gulp/' + file);
});

// 执行打包
gulp.task('default', ['clean'], function () {
	gulp.start('build');
});