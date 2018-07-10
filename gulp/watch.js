var path = require('path'),
	gulp = require('gulp'),
	scss = require('gulp-sass-china'),
	browserSync = require('browser-sync'),
	px2rem = require('gulp-px2rem-plugin'),
	conf = require('./conf');

// scss
gulp.task('scss', function(){

	return gulp.src(path.join(conf.paths.src, '/scss/*.scss'))
        .pipe(scss())
		.on('error', scss.logError)
		//.pipe(px2rem({'width_design': 240,'valid_num':2,'pieces':10}))
        .pipe(gulp.dest(path.join(conf.paths.tmp, 'serve/css')));
});

// 开启服务
gulp.task('watch', ['inject'], function(){

	// 监听JS插件
	gulp.watch([path.join(conf.paths.src, '/*.html'), 'bower.json'], ['inject-reload']);

	// 监听scss
	gulp.watch(path.join(conf.paths.src, '/scss/*.scss'), function(event) {
		gulp.start('scss');
	});

	// 监听CSS
	gulp.watch(path.join(conf.paths.tmp, '/**/*.css'), function(event) {
		if(isOnlyChange(event)) {
			browserSync.reload(event.path);
		} else {
			gulp.start('inject-reload');
		}
	});

	// 监听js
	gulp.watch(path.join(conf.paths.src, '/**/*.js'), function(event) {
		if(isOnlyChange(event)) {
			gulp.start('scripts-reload');
		} else {
			gulp.start('inject-reload');
		}
	});

	// 监听html
	gulp.watch(path.join(conf.paths.src, '/**/*.html'), function(event){
		browserSync.reload(event.path);
	});
});

// 判断是否改变
function isOnlyChange(event) {
	return event.type != 'changed'
}
