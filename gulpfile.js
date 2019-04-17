const gulp = require('gulp');
const concat = require('gulp-concat');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const uglify = require('gulp-uglify');
//var pipeline = require('readable-stream').pipeline;
const del= require('del');
const browserSync = require('browser-sync').create();
const webpack = require('webpack-stream');

const css_files = [
//	'./node_modules/node-normalize-scss/_normalize.scss',
	'./src/css/other.css',
	'./src/css/style.css'
]

/*
const js_files = [
	'./src/js/lib.js',
	'./src/js/some.js'
]*/

let webpack_config = {
	output: {
		filename: 'all.js'
	},
  module: {
    rules: [
	  {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude:'/node_modules/'
      },
    ]
  }
};

function styles() {
	return gulp.src(css_files)
				.pipe(autoprefixer({
					browsers: ['> 0.1%'],
					cascade: false
				}))
				.pipe(concat('all.css'))
				.pipe(cleanCSS({
					level: 2
				}))
				.pipe(gulp.dest('./build/css'))
				.pipe(browserSync.stream());
}

function script() {
	return gulp.src('./src/js/some.js')
/*				.pipe(concat('all.js'))
				.pipe(uglify({
					toplevel: true					
				}))*/
				.pipe(webpack(webpack_config))
				.pipe(gulp.dest('./build/js'))
				.pipe(browserSync.stream());
}

function html() {
	return gulp.src('./*.html')
				.pipe(browserSync.stream());
}

function watch() {
    browserSync.init({
        server: {
            baseDir: "./"
        },
//        tunnel: true
    });

	gulp.watch('./src/css/**/*.css', styles);
	gulp.watch('./src/js/**/*.js', script);
	gulp.watch('./*.html', html);
}

function clean() {
	return del(['build/*'])
}

//gulp.task('styles', styles);
//gulp.task('script', script);
gulp.task('watch', watch);
gulp.task('build', gulp.series(clean, gulp.parallel(styles, script)));
gulp.task('clean', clean);
gulp.task('dev', gulp.series('build', watch));

//module.exports.watch = watch;