var gulp = require('gulp'),
    sass = require('gulp-sass'),
    browserSync = require('browser-sync'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglifyjs'),
    cssnano = require('gulp-cssnano'),
    rename = require('gulp-rename'),
    clear = require('del'),
    autoprefixer = require('gulp-autoprefixer'),
    sourceMaps = require('gulp-sourcemaps'),
    spritesmith = require('gulp.spritesmith');

gulp.task('sass', async function () {
    return gulp.src('app/sass/**/*.scss')
        .pipe(sourceMaps.init())
        .pipe(sass())
        .pipe(autoprefixer(['last 15 versions']))
        .pipe(cssnano())
        .pipe(sourceMaps.write())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('app/css'))
        .pipe(browserSync.reload({stream: true}))
});

gulp.task('browser-sync', function () {
    browserSync({
        server: {
            baseDir: 'app'
        },
        notify: false
    });
});

gulp.task('code', function () {
    return gulp.src('app/*.html')
        .pipe(browserSync.reload({stream: true}))
});

gulp.task('myScripts', function () {
    return gulp.src('app/js/**/*.js')
        .pipe(browserSync.reload({stream: true}))
});

gulp.task('scripts', function () {
    return gulp.src([
        'node_modules/jquery/dist/jquery.min.js',
        'node_modules/magnific-popup/dist/jquery.magnific-popup.min.js'
    ])
        .pipe(concat('libs.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('app/js'))
});

gulp.task('spritesmith', async function () {
    var spriteData = gulp.src('app/sprites/**/*')
        .pipe(spritesmith({
            imgName: 'sprite.png',
            cssName: '_sprite.css' //необходимо отредактировать пути к спрайтам
        }));
    spriteData.img.pipe(gulp.dest('app/img/'));
    spriteData.css.pipe(gulp.dest('app/sass/import/'));
});

gulp.task('clean', async function () {
    return clear.sync('dist')
});

gulp.task('build', function () {
    var buildCss = gulp.src('app/css/main.min.css')
        .pipe(gulp.dest('dist/css'));

    var buildFonts = gulp.src('app/fonts/**/*')
        .pipe(gulp.dest('dist/fonts'));

    var buildJs = gulp.src('app/js/**/*')
        .pipe(gulp.dest('dist/js'));

    var buildHtml = gulp.src('app/*.html')
        .pipe(gulp.dest('dist'));

    var buildImg = gulp.src('app/img/**/*')
        .pipe(gulp.dest('dist'));
});

gulp.task('watch', function () {
    gulp.watch('app/sass/**/*.scss', gulp.parallel('sass'));
    gulp.watch('app/*.html', gulp.parallel('code'));
    gulp.watch('app/js/**/*.js', gulp.parallel('myScripts'));
});

gulp.task('default', gulp.series('sass', 'scripts', 'myScripts', 'browser-sync', 'watch', 'clean', 'build'));