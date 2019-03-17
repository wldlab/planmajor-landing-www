var gulp = require("gulp");
var moduleImporter = require("sass-module-importer");
var sass = require("gulp-sass");
var browserSync = require("browser-sync").create();
var postcss = require("gulp-postcss");
var autoprefixer = require("autoprefixer");
var csso = require("gulp-csso");

const BROWSER_SUPPORT = [
  "ie >= 10",
  "ie_mob >= 10",
  "ff >= 30",
  "chrome >= 34",
  "safari >= 7",
  "opera >= 23",
  "ios >= 7",
  "android >= 4.4",
  "bb >= 10"
];

gulp.task("copy", function() {
  return gulp
    .src(["src/**/*", "!src/**/*.scss", "!src/.DS_Store"], {
      dot: true,
      allowEmpty: false
    })
    .pipe(gulp.dest("dist"));
});

gulp.task("style", function() {
  const plugins = [autoprefixer({ browsers: BROWSER_SUPPORT })];
  return gulp
    .src("src/stylesheets/**/*.scss")
    .pipe(sass({ importer: moduleImporter() }).on("error", sass.logError))
    .pipe(postcss(plugins))
    .pipe(csso())
    .pipe(gulp.dest("dist/css"))
    .pipe(browserSync.stream());
});

gulp.task("serve", function() {
  browserSync.init({
    server: {
      baseDir: "./dist"
    },
    open: false
  });
  gulp
    .watch(["src/**/*", "!src/**/*.{scss,js}"], ["copy"])
    .on("change", browserSync.reload);
  gulp
    .watch("src/stylesheets/**/*.scss", ["style"])
    .on("change", browserSync.reload);
});

gulp.task("dev", ["copy", "style", "serve"]);

gulp.task("build", ["copy", "style"]);
