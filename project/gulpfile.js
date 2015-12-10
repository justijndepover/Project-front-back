/**
 * Created by justijndepover on 01/12/15.
 */

var gulp = require("gulp"),
    csslint = require("gulp-csslint"),
    cssMinifier = require("gulp-minify-css"),
    sourcemaps =  require("gulp-sourcemaps"),
    concat = require("gulp-concat"),
    less = require("gulp-less"),
    notify = require("gulp-notify"),
    jshint = require("gulp-jshint"),
    jsstylish = require("jshint-stylish"),
    uglify = require("gulp-uglify");
    //gulpWebpack = require("gulp-webpack"),
    //webpackConfig = require("./webpack.config.js"),
    //stream = require("webpack-stream");

var path = {
    HTML: 'src/index.html',
    ALL: ['src/**/*.jsx', 'src/**/*.js'],
    MINIFIED_OUT: 'app.bundle.js',
    DEST_SRC: 'src',
    DEST_BUILD: 'build',
    DEST: 'public'
};

gulp.task("default", function(){

    gulp.watch("./src/less/desktop/**/*.less", ['css-desktop-build']);
    gulp.watch("./src/less/mobile/**/*.less", ['css-mobile-build']);
    gulp.watch("./src/js/**/*.js", ['js-desktop-build', 'js-mobile-build']);
    //gulp.watch(path.ALL, ['webpack']);
});

/*gulp.task("webpack", function(){
    gulp.src(path.ALL)
        .pipe(sourcemaps.init())
        .pipe(stream(webpackConfig))
        .pipe(uglify())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(path.DEST_BUILD));
});*/

gulp.task("css-mobile-build", function(){

    gulp.src("./src/less/mobile/**/*.less")
        .pipe(less())
        .pipe(csslint(
            {
                'ids': false
            }))
        .pipe(sourcemaps.init())
        .pipe(cssMinifier())
        .pipe(concat("app.min.css"))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest("./dist/mobile/css"));
});

gulp.task("css-desktop-build", function(){

    gulp.src("./src/less/desktop/**/*.less")
        .pipe(less())
        .pipe(csslint(
            {
                'ids': false
            }))
        .pipe(sourcemaps.init())
        .pipe(cssMinifier())
        .pipe(concat("app.min.css"))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest("./dist/desktop/css"));
});

gulp.task("js-mobile-build", function(){
    gulp.src(["./src/app.js",
        "./src/js/mobile/**/*.js"])
        //.pipe(jshint())
        //.pipe(jshint.reporter(jsstylish))
        .pipe(sourcemaps.init())
        .pipe(concat("app.min.js"))
        .pipe(uglify())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest("./dist/mobile/js"));
});

gulp.task("js-desktop-build", function(){
    gulp.src("./src/js/desktop/**/*.js")
        //.pipe(jshint())
        //.pipe(jshint.reporter(jsstylish))
        .pipe(sourcemaps.init())
        .pipe(concat("app.min.js"))
        .pipe(uglify())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest("./dist/desktop/js"));
});