var gulp = require("gulp"),
  rename = require("gulp-rename"),
  watch = require("gulp-watch"),
  browserSync = require("browser-sync").create(),
  postcss = require("gulp-postcss"),
  autopre = require("autoprefixer"),
  csso = require("gulp-csso"),
  sass = require("gulp-sass"),
  minify = require("gulp-minifier");
concat = require("gulp-concat"),
  gcmq = require('gulp-group-css-media-queries');

var url = "http://localhost/experiment-site";

gulp.task("watch", function () {
  browserSync.init({
    proxy: url,
    ghostMode: false
  });
  watch(["./js/*.js", "!./js/scripts-bundle.js"], gulp.series("scripts"));
  watch("./js/backend-js/scripts.js", gulp.series("admin-scripts"));
  watch("./styles/**/*.scss", gulp.series("styles"));
  watch("./backend-styles/*.scss", gulp.series("admin-styles"));

  watch("./**/*.php", function (done) {
    browserSync.reload();
    done;
  });
});

gulp.task("admin-scripts", function () {
  return gulp
    .src("./js/backend-js/scripts.js")
    .pipe(
      minify({
        minify: true,
        minifyJS: {
          sourceMap: false
        }
      })
    )
    .pipe(
      rename({
        suffix: ".min"
      })
    )
    .pipe(gulp.dest("js/backend-js"));
});

gulp.task("scripts", function () {
  return gulp
    .src("./js/*.js")
    .pipe(concat('scripts-bundle.js'))
    .pipe(
      minify({
        minify: true,
        minifyJS: {
          sourceMap: false
        }
      })
    )
    .pipe(
      rename({
        suffix: ".min"
      })
    )
    .pipe(gulp.dest("js/min"));
});

gulp.task("load", function () {
  browserSync.reload();
});

gulp.task("styles-o", function () {
  watch(
    ["./styles/**/*.scss", "!./styles/backend-styles/*.scss"],
    gulp.series("styles", "admin-styles")
  );
});

gulp.task("styles", function (done) {
  return gulp
    .src("./styles/main.scss")
    .pipe(sass())
    .pipe(postcss([autopre]))
    .pipe(gcmq())
    .pipe(gulp.dest("./styles"))
    .pipe(csso())
    .pipe(
      rename({
        basename: "main.min"
      })
    )
    .pipe(gulp.dest("./styles"))
    .pipe(browserSync.stream());
  done();
});

gulp.task("admin-styles", function (done) {
  return gulp
    .src("./backend-styles/admin-main.scss")
    .pipe(sass())
    .pipe(postcss([autopre]))
    .pipe(gulp.dest("./backend-styles"))
    .pipe(csso())
    .pipe(gcmq())
    .pipe(
      rename({
        basename: "admin-main.min"
      })
    )
    .pipe(gulp.dest("./backend-styles"))
    .pipe(browserSync.stream());
  done();
});

gulp.task("default", function (done) {
  console.log("Default Working");
  done();
});