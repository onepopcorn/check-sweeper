var gulp   = require('gulp'),
	jshint = require('gulp-jshint'),
	uglify = require('gulp-uglify'),
	html   = require('gulp-htmlhint'),
	sass   = require('gulp-sass'),
	clean  = require('gulp-clean'),
	sync   = require('browser-sync');

var paths = {
	scripts : 'src/js/**/*.js',
	styles  : 'src/css/**/*.scss',
	html    : 'src/*.html',
	images  : ['src/img/**/*.png','src/img/**/*.jpg','src/img/**/*.gif']
}


///////// Cleaning tasks /////////
gulp.task('markup-clean',function(){
	return gulp.src('bin/*.html')
		   .pipe(clean());
});

gulp.task('scripts-clean',function(){
	return gulp.src('bin/js/**/*.js')
		   .pipe(clean());
});

gulp.task('styles-clean',function(){
	return gulp.src('bin/css/**/*.css')
		   .pipe(clean());
});

///////// Main tasks /////////
gulp.task('markup',['markup-clean'],function(){
	return gulp.src(paths.html)
		   .pipe(html())
		   .pipe(gulp.dest('bin'));
});

gulp.task('scripts',['scripts-clean'],function(){
	return gulp.src(paths.scripts)
		   .pipe(jshint())
		   .pipe(uglify())
		   .pipe(gulp.dest('bin/js'));
});

gulp.task('styles',['styles-clean'],function(){
	return gulp.src(paths.styles)
		   .pipe(sass())
		   .pipe(gulp.dest('bin/css'));
});

///////// Watch tasks /////////
gulp.task('watch',function(){
	gulp.watch(paths.scripts,['scripts',sync.reload]);
	gulp.watch(paths.styles,['styles',sync.reload]);
	gulp.watch(paths.html,['markup',sync.reload]);
});

///////// Server /////////
gulp.task('server',function(){
	sync({
		server: {
			baseDir:'bin'
		}
	})
});


gulp.task('default',['markup','scripts','styles','watch','server']);