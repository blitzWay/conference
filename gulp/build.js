var path = require('path'),
	gulp = require('gulp'),
	inject = require('gulp-inject'),
	browserSync = require('browser-sync').create(),
	zip = require('gulp-zip'),
	del = require('del'),
	templateCache = require('gulp-angular-templatecache'),
	htmlmin = require('gulp-htmlmin'),
	ngAnnotate = require('gulp-ng-annotate'),
	angularFilesort = require('gulp-angular-filesort'),
	uglify = require('gulp-uglify'),
	uglifySaveLicense = require('uglify-save-license'),
	cssmin = require('gulp-clean-css'),
	rev = require('gulp-rev'),
    replace = require('gulp-replace'),
	revReplace = require('gulp-rev-replace'),
	zip = require('gulp-zip'),
	filter = require('gulp-filter'),
	useref = require('gulp-useref'),
	size = require('gulp-size'),
	environments = require('gulp-environments'),
    cache = require('gulp-cache'),
    flatten = require('gulp-flatten'),
	mainBowerFiles = require('main-bower-files'),
	conf = require('./conf'),
	htmlOptions = {
        removeComments: true,//清除HTML注释
        collapseWhitespace: true,//压缩HTML
        collapseBooleanAttributes: true,//省略布尔属性的值 <input checked="true"/> ==> <input />
        removeEmptyAttributes: true,//删除所有空格作属性值 <input id="" /> ==> <input />
        removeScriptTypeAttributes: true,//删除<script>的type="text/javascript"
        removeStyleLinkTypeAttributes: true,//删除<style>和<link>的type="text/css"
        minifyJS: true,//压缩页面JS
        minifyCSS: true,//压缩页面CSS
        caseSensitive: true, // 区分大小写
        keepClosingSlash: true // 在单体元素上保持斜线
    };

// clean
gulp.task('clean', function() {
	return del([
			path.join(conf.paths.build),
			path.join(conf.paths.tmp),
			path.join(conf.paths.zipBuild),
			path.join(conf.paths.zip)
		]);
});

gulp.task('clean-zip', function() {
    return del([
            path.join(conf.paths.zip)
        ]);
});

// templateCache
gulp.task('partials', function () {

	return gulp.src(path.join(conf.paths.src, '/template/**/*.html'))
		.pipe(htmlmin(htmlOptions))
		.pipe(templateCache({
			module: 'app',
			root: 'template'
		}))
		.pipe(gulp.dest(path.join(conf.paths.tmp, '/partials/')));
});

// fonts
gulp.task('fonts', function () {
  return gulp.src(mainBowerFiles())
    .pipe(filter('**/*.{eot,svg,ttf,woff,woff2}'))
    .pipe(flatten())
    .pipe(gulp.dest(path.join(conf.paths.build, '/fonts/')));
});

// image
gulp.task('image', function(){
	return gulp.src(path.join(conf.paths.src, '/img/**/*.{png,jpg,gif,ico}'))
		.pipe(gulp.dest(path.join(conf.paths.build, '/img')));
});

// xml
gulp.task('xml', function(){

    return gulp.src('./main.xml')
			.pipe(htmlmin(htmlOptions))
			.pipe(gulp.dest('./build'));
});

// html
gulp.task('html', ['inject', 'partials'], function () {
	// 引用 templateHtml
	var partialsInjectFile = gulp.src(path.join(conf.paths.tmp, '/partials/templates.js'), { read: false });
	var partialsInjectOptions = {
    	starttag: '<!-- inject:partials -->',
    	ignorePath: path.join(conf.paths.tmp, '/partials'),
    	addRootSlash: false
	};

	// filter 相关目录的文件
	var htmlFilter = filter('*.html', { restore: true, passthrough: true }),
  		jsFilter = filter(['**/*.js'], { restore: true, passthrough: true }),
  		cssFilter = filter('**/*.css', { restore: true, passthrough: true }),
  		assets;

	return gulp.src(path.join(conf.paths.tmp, '/serve/*.html'))
    	.pipe(inject(partialsInjectFile, partialsInjectOptions))
    	.pipe(assets = useref.assets())
	    .pipe(rev())
	    .pipe(jsFilter)
	   	.pipe(ngAnnotate())
	   	.pipe(uglify({ preserveComments: uglifySaveLicense }))
	    //.on('error', conf.errorHandler('Uglify'))
	    .pipe(jsFilter.restore)
	    .pipe(cssFilter)
	    .pipe(cssmin({
            advanced: false,//类型：Boolean 默认：true [是否开启高级优化（合并选择器等）]
            compatibility: 'ie8',//保留ie7及以下兼容写法 类型：String 默认：''or'*' [启用兼容模式； 'ie7'：IE7兼容模式，'ie8'：IE8兼容模式，'*'：IE9+兼容模式]
            keepBreaks: true,//类型：Boolean 默认：false [是否保留换行]
            keepSpecialComments: '*',
            //保留所有特殊前缀 当你用autoprefixer生成的浏览器前缀，如果不加这个参数，有可能将会删除你的部分前缀
        	processImport: false
        }))
        .pipe(replace('.tmp/serve', '..'))
	    .pipe(cssFilter.restore)
	    .pipe(assets.restore())
	    .pipe(useref())
	    .pipe(revReplace())
	    .pipe(htmlFilter)
	    .pipe(htmlmin(htmlOptions))
	    .pipe(htmlFilter.restore)
	    .pipe(gulp.dest(path.join(conf.paths.build, '/')))
	    .pipe(size({ title: path.join(conf.paths.build, '/'), showFiles: true }));
});

// 构建
gulp.task('build', ['html', 'xml', 'image', 'fonts', 'clean-zip'], function () {
	return gulp.src(path.join(conf.paths.zipBuild, '/**/*'))
		.pipe(zip(environments.development() ? 'dev.zip' : 'prod.zip'))
		.pipe(rev())
		.pipe(gulp.dest(conf.paths.zip));
});
