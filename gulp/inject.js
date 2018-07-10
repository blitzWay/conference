var path = require('path'),
	gulp = require('gulp'),
	inject = require('gulp-inject'),
	environments = require('gulp-environments'),
	angularFilesort = require('gulp-angular-filesort'),
	browserSync = require('browser-sync'),
	wiredep = require('wiredep').stream,
	lodash = require('lodash'),
	conf = require('./conf');

// 重新inject
gulp.task('inject-reload', ['inject'], function() {
	browserSync.reload();
});

// inject index.html的src
gulp.task('inject', ['scss', 'scripts'], function() {
	// css 引入
	var injectCss = gulp.src([
	    	path.join(conf.paths.tmp, '/**/*.css')
	  	], { read: false });

	// js 引入
	var injectJs = gulp.src([
	    	path.join(conf.paths.src, '/js/**/*.js'),
	    	// 开发环境排除掉 "*.prod.js", 生产环境排除掉 "*.dev.js"
	    	path.join('!' + conf.paths.src, environments.development() ? '/js/*.prod.js' :  '/js/*.dev.js'),
		])
	  	.pipe(angularFilesort());
	
	// 删除源文件
	var injectOptions = {
		ignorePath: [conf.paths.src, path.join(conf.paths.tmp, '/serve')],
    	addRootSlash: false
	};

	return gulp.src(path.join(conf.paths.src, '/*.html'))
		.pipe(inject(injectCss, injectOptions))
		.pipe(inject(injectJs, injectOptions))
		.pipe(wiredep(lodash.extend({}, conf.wiredep)))
		.pipe(gulp.dest(path.join(conf.paths.tmp, '/serve')));
});