/**
 * requirements
 */

/** basic **/
var gulp            = require('gulp');
var runSequence     = require('run-sequence');
var env             = require('gulp-env');
var browserSync     = require('browser-sync');

/** postcss **/
var postcss         = require('gulp-postcss');
var sass = require('gulp-sass');
var autoprefixer    = require('autoprefixer');
var inline_comment  = require('postcss-inline-comment');
var lost            = require('lost');

/** utils **/
const imagemin = require('gulp-imagemin');
var sourcemaps      = require('gulp-sourcemaps');
var changed         = require('gulp-changed');
var plumber         = require('gulp-plumber');
var gutil           = require('gulp-util');
var cssnano         = require('gulp-cssnano');
var concat          = require('gulp-concat');
var uglify          = require('gulp-uglify');
var rename          = require('gulp-rename');
var del             = require('del');

/** twig **/
var twig            = require('gulp-twig');
var path            = require('path');
var fs              = require('fs');

/** iconfonts **/
var iconfont        = require('gulp-iconfont');
var consolidate     = require('gulp-consolidate');




var files = [
  'src/resource/*.*',
];

gulp.task('distribute', function() {
    return gulp.src(files)
        .pipe(gulp.dest('./public/'));
});
/*
 * settings
 */

var reload = browserSync.reload;

var onError = function(error) {
	gutil.beep();
	gutil.log(gutil.colors.red('Error [' + error.plugin + ']: ' + error.message));
	this.emit('end');
};

var basePath = {
	src: 'src/',
	dest: 'public/'
}

var src = {
	fonts: basePath.src + 'fonts/',
	img  : basePath.src + 'img/',
	js   : basePath.src + 'js/',
	plugins : basePath.src + 'js/plugins/',
	css  : basePath.src + 'postcss/',
	pages: basePath.src + 'twig/',
	json : basePath.src + 'json/'
}

var dest = {
	fonts: basePath.dest + 'fonts/',
	img  : basePath.dest + 'img/',
	js   : basePath.dest + 'js/',
	css  : basePath.dest + 'css/'
}

env({
	file: '.env.json'
})



/*
 * sub tasks
 */

gulp.task('clean', function() {
	del(dest.css);
	del('public/images');
	del('public/*.html');
});

gulp.task('browser-sync', function() {
	browserSync.init({
		port: process.env.PORT,
		notify: false,
		open: false,
		server: {
			baseDir: basePath.dest
		}
	});

	gulp.watch(src.js + '**/*.js', ['scripts']);
	gulp.watch(src.css + '**/*.scss', ['make:css']);
	gulp.watch(src.fonts + '**/*.svg', ['generate-icons']);
	gulp.watch(src.pages + '**/*.twig', ['watch:pages']);
	gulp.watch(src.js + '**/*.js', reload);
	gulp.watch('src/images/*', function(event) {
    gulp.run('image');
  });
});

gulp.task('scripts', function() {
	return gulp.src(['./src/js/plugins/jquery*.js', './src/js/plugins/*.js', './src/js/custom/*.js'])
	.pipe(plumber())
	.pipe(sourcemaps.init())
	.pipe(concat('main.js'))
	.pipe(sourcemaps.write('.'))
	.pipe(gulp.dest('./public/js/'))
	.pipe(browserSync.stream());
});

// gulp.task('make:plugins', function() {
// 	return gulp.src([
// 		src.plugins + '**/*.js',
// 		src.js + 'global/*.js'

// 	])
// 	.pipe(concat('plugins.concat.js'))
// 	.pipe(gulp.dest('public/js'));
// });

// gulp.task('make:js', ['make:plugins'], function() {
// 	return gulp.src([
// 		src.js + 'plugins.concat.js',
// 		src.js + 'order/init.js',
// 		src.js + 'order/matchmedia.js',
// 		src.js + 'global/*',
// 		src.js + 'main/*'
// 	])
// 	.pipe(plumber({
// 		errorHandler: onError
// 	}))
// 	.pipe(concat('main.min.js'))
// 	.pipe(gulp.dest(dest.js))
// 	.pipe(browserSync.stream());
// });

gulp.task('watch:pages', ['make:pages'], reload);

gulp.task('make:pages', function() {
	return gulp.src([src.pages + '**/!(_)*.twig', src.pages + '**/inc/!(_)*.twig'])
		.pipe(plumber({
			errorHandler: onError
		}))
		.pipe(twig({
			base: src.pages
		}))
		.pipe(gulp.dest(basePath.dest));
});

gulp.task('image', function() {
    gulp.src('src/images/**')
        .pipe(imagemin())
        .pipe(gulp.dest('public/images'));
});


gulp.task('make:css', function() {
	var plugins = [
		autoprefixer({ browsers: ['last 2 versions'] }),
		lost,
		inline_comment()
	]
	return gulp.src(src.css + '*.scss')
		.pipe(plumber({
			errorHandler: onError
		}))
		.pipe(changed(src.css + '**/*.scss'))
		.pipe(sourcemaps.init())
		.pipe(sass().on('error', sass.logError))
		.pipe(postcss(plugins))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest(dest.css))
		.pipe(browserSync.stream());
});

gulp.task('minify', ['make:css', 'scripts'], function() {
	gulp.src(dest.css + '*.css')
		.pipe(cssnano())
		.pipe(gulp.dest(dest.css))

	gulp.src(dest.js + '*.js')
		.pipe(uglify())
		.pipe(gulp.dest(dest.js))
});

 gulp.task('generate-icons', function() {
	var font_name = 'icon';
	var file_name = 'icons';
	return gulp.src(src.fonts + 'icons/*.svg')
		.pipe(iconfont({
			fontName: font_name,
			prependUnicode: true,
			appendUnicode: false,
			normalize: true,
			fontHeight: 1001
		}))
		.on('glyphs', function(glyphs, options) {
			var font_options = function(value) {
				var options = {
					glyphs: glyphs,
					className: font_name,
					fontName: font_name,
					fontPath: ''
				}
				value == 'demo' ? options.fontPath = '../' : options.fontPath = '../fonts/';
				return options;
			}
			gulp.src(src.fonts + 'templates/template.css')
				.pipe(consolidate('lodash', font_options('pub')))
				.pipe(rename({ basename: '_' + file_name, extname: '.scss' }))
				.pipe(gulp.dest(src.css + 'base/'));
			gulp.src(src.fonts + 'templates/template.css')
				.pipe(consolidate('lodash', font_options('demo')))
				.pipe(rename({ basename: file_name }))
				.pipe(gulp.dest(dest.fonts + '/template/'));
			gulp.src(src.fonts + 'templates/template.html')
				.pipe(consolidate('lodash', font_options))
				.pipe(rename({
					basename: 'icon-sample'
				}))
				.pipe(gulp.dest(dest.fonts + '/template/'));
		})
		.pipe(gulp.dest(dest.fonts));
});

/*
 * main tasks
 */

gulp.task('build', function() {
	runSequence('generate-icons', ['clean', 'make:css'], 'scripts', 'make:pages', 'image', 'distribute');
});

gulp.task('default', ['browser-sync', 'make:pages', 'scripts']);

gulp.task('watch', ['browser-sync', 'make:pages', 'scripts']);
