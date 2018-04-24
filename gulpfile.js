const gulp = require("gulp");
const mocha = require("gulp-mocha");
const eslint = require("gulp-eslint");

gulp.task("test", () => {
    gulp.src("test/**/*.js", { read: false })
        .pipe(mocha({ reporter: "nyan" }));
});

gulp.task("lint", () => {
    return gulp.src(["**/*.js", "!node_modules/**"])
        .pipe(eslint())
        .pipe(eslint.failAfterError());
});

gulp.task("default", ["lint", "test"], () => {
    // noting to do.
});
