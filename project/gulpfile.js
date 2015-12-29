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

gulp.task("default", function(){
    gulp.watch("./src/less/desktop/**/*.less", ['css-desktop-build']);
    gulp.watch("./src/less/mobile/**/*.less", ['css-mobile-build']);
    gulp.watch(["./src/js/desktop/**/*.js","./src/js/shared/**/*.js"], ['js-desktop-build']);
    gulp.watch(["./src/js/mobile/**/*.js","./src/js/shared/**/*.js"], ['js-mobile-build']);
});

gulp.task("css-mobile-build", function(){

    gulp.src("./src/less/mobile/**/*.less")
        .pipe(less())
        .pipe(csslint(
            {
                'ids': false
            }))
        .pipe(sourcemaps.init())
        .pipe(cssMinifier())
        .pipe(concat("style.min.css"))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest("./public/mobile/css"));
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
        .pipe(concat("style.min.css"))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest("./public/desktop/css"));
});

gulp.task("js-mobile-build", function(){
    gulp.src(["./src/app.js",
        "./src/js/mobile/**/*.js",
        "./src/js/shared/**/*.js"])
        //.pipe(jshint())
        //.pipe(jshint.reporter(jsstylish))
        .pipe(sourcemaps.init())
        .pipe(concat("app.min.js"))
        .pipe(uglify())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest("./public/mobile/js",{overwrite: true}));
});

gulp.task("js-desktop-build", function(){
    gulp.src(["./src/app.js",
        "./src/js/desktop/**/*.js",
        "./src/js/shared/**/*.js"])
        //.pipe(jshint())
        .pipe(jshint.reporter(jsstylish))
        .pipe(sourcemaps.init())
        .pipe(concat("app.min.js"))
        .pipe(uglify())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest("./public/desktop/js",{overwrite: true}));
});