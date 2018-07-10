var path = require('path'),
	gulp = require('gulp'),
	browserSync = require('browser-sync'),
	browserSyncSpa = require('browser-sync-spa'),
	conf = require('./conf');

gulp.task('serve', ['watch'], function () {
	browserSyncInit([path.join(conf.paths.tmp, '/serve'), conf.paths.src]);
});

gulp.task('serve:build', ['build'], function () {
	 browserSyncInit(conf.paths.build);
});

// 根据参数启动相应服务
function browserSyncInit(baseDir) {
	var routes = {
      	'/bower_components': 'bower_components'
    };

	var server = {
		baseDir: baseDir,
		routes: routes
	};

	browserSync.init({
		startPath: '/',
		server: server
	});
}

browserSync.use(browserSyncSpa({
	selector: '[ng-app]'// Only needed for angular apps
}));