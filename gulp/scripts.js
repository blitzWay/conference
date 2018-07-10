var path = require('path'),
	gulp = require('gulp'),
	eslint = require('gulp-eslint'),
	size = require('gulp-size'),
	browserSync = require('browser-sync'),
	conf = require('./conf');

gulp.task('scripts-reload', function() {

	return buildScripts()
  		.pipe(browserSync.stream());
});

gulp.task('scripts', function() {

	return buildScripts();
});

// 检查JS是否有错误
function buildScripts() {

  	return gulp.src([path.join(conf.paths.src, '/js/**/*.js'), '!' + path.join(conf.paths.src, '/js/ns-sdk-2.0.9.js')])
    	.pipe(eslint({
    		/*
    		 * 规则说明
    		 * 0 - 不验证 "warn"
    		 * 1 - 警告 "error"
    		 * 2 - 错误
    		 */
	        rules: { 
	            'no-alert': 0, // 代码中禁止使用alert, confirm, and prompt
				'no-bitwise': 0,  // 禁止使用位操作符
				'camelcase': 1, // 强制使用驼峰命名 
				'curly': [2, "all"], // default: [2, "all"] 全都需要{ }包围
				'eqeqeq': 0, // 在进行比较时，必须使用全等=== 和完全不等!==
				'no-eq-null': 0, // 保证了在和null比较时使用===和!==，而不能够使用==和!=
				'guard-for-in': 1, //在for-in 循环中要使用if语句
				'no-empty': 1, // 代码块的内容不能为空，禁止空代码块
				'no-use-before-define': 0, // 所有的变量都应该先定义后使用
				'no-obj-calls': 2, // 禁止把全局对象当函数调用，比如下面写法错误的：Math(), JSON()
				'no-unused-vars': 0, // 不允许定义的变量在后面的代码中没有被使用到
				'new-cap': 1, // 使用构造函数(new)时首字母需大写，首字母大写的函数需用new操作符
				'no-shadow': 0, // 禁止声明外部作用域中已定义的变量
				'strict': 0, // 使用严格模式
				'no-invalid-regexp': 2, // 禁止使用无效的正则语句
				'comma-dangle': 2, // always-multiline：多行模式必须带逗号，单行模式不能带逗号  
				'no-undef': 2, // 禁止使用未被定义的变量，除非已在配置文件的global中进行了说明。
				'no-new': 1, // 在使用new来调用构造函数后，必须把生成的实例赋值给一个变量
				'no-extra-semi': 2, //禁止多余的冒号 0 1 2
				'no-debugger': 2, // 禁止使用debugger语句
				'no-caller': 1, // 禁止使用arguments.caller和arguments.callee
				"semi": [2, "always"], // 默认配置always，要求在行末加上分号。
				'quotes': [2, 'single'], // 引号
				'no-unreachable': 2, // 禁止有执行不到的代码
				"space-infix-ops": 2, // 中綴操作符左右是否添加空格
				"no-extra-parens": 0 // 禁止使用多余的圆括号
	        },
	        globals: [
	            'angular',
	            'ns'
	        ],
	        envs: [
	            'browser'
	        ]
	    }))
    	.pipe(eslint.format())
    	.pipe(size())
};