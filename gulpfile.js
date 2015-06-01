var gulp       = require('gulp'),
	del        = require('del'),
	colors     = require('colors'),
	concat     = require('gulp-concat'),
	vinylpaths = require('vinyl-paths'),
	jshint     = require('gulp-jshint'),
	uglify     = require('gulp-uglify'),
	sync       = require('browser-sync'),
	plumber    = require('gulp-plumber'),
	html       = require('gulp-htmlhint'),
	sass       = require('gulp-ruby-sass'),
	smaps      = require('gulp-sourcemaps');

var paths = {
	scripts : 'src/js/**/*.js',
	styles  : 'src/css/**/*.scss',
	html    : 'src/*.html',
	images  : ['src/img/**/*.png','src/img/**/*.jpg','src/img/**/*.gif']
}

///////// Error handling /////////
function errorHanlder(err){
	console.error('['+'error:'.red+']',err.message);
	console.error('['+'line:'.red+']',err.lineNumber);
	console.log('['+'file:'.red+']', err.fileName);
};


///////// Cleaning tasks /////////
gulp.task('markup-clean',function(){
	return gulp.src('bin/*.html')
		   .pipe(vinylpaths(del));
});

gulp.task('scripts-clean',function(){
	return gulp.src('bin/js/**/*.js')
		   .pipe(vinylpaths(del));
});

gulp.task('styles-clean',function(){
	return gulp.src('bin/css/**/*.css')
		   .pipe(vinylpaths(del));
});

gulp.task('assets-clean',function(){
	return gulp.src('bin/img/**/*.*')
		   .pipe(vinylpaths(del));
});

///////// Main tasks /////////
gulp.task('markup',['markup-clean'],function(){
	return gulp.src(paths.html)
		   .pipe(plumber())
		   .pipe(html())
		   .on('error', errorHanlder)
		   .pipe(gulp.dest('bin'));
});

gulp.task('scripts',['scripts-clean'],function(){
	return gulp.src(paths.scripts)
		   .pipe(plumber())
		   .pipe(jshint())
		   .pipe(jshint.reporter('default'))
		   .on('error', errorHanlder)
		   .pipe(smaps.init())
		   .pipe(uglify())
		   .pipe(concat('main.js'))
		   .on('error', errorHanlder)
		   .pipe(smaps.write())
		   .pipe(gulp.dest('bin/js'));
});

gulp.task('styles',['styles-clean'],function(){
	return sass('src/css',{style: 'compressed'})
		   .on('error', errorHanlder)
		   .pipe(gulp.dest('bin/css'));
});

gulp.task('assets',['assets-clean'],function(){
	return gulp.src(paths.images)
		   .pipe(plumber())
		   .pipe(gulp.dest('bin/img'));
});

///////// Watch tasks /////////
gulp.task('watch',function(){
	gulp.watch(paths.scripts,['scripts',sync.reload]);
	gulp.watch(paths.styles,['styles',sync.reload]);
	gulp.watch(paths.html,['markup',sync.reload]);
	gulp.watch(paths.images,['assets',sync.reload]);
});

///////// Server /////////
gulp.task('server',function(){
	sync({
		server: {
			baseDir:'bin'
		}
	})
});


gulp.task('default',['markup','scripts','styles','assets','watch','server']);