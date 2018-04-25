const gulp = require("gulp");
const mocha = require("gulp-mocha");
const eslint = require("gulp-eslint");

gulp.task("test", () => {
    gulp.src("test/**/*.js", { read: false })
        .pipe(mocha({ reporter: "nyan" }));
});

gulp.task("lint", () => {
    return gulp.src(["./*.js", "test/*.js", "!node_modules/**"])
        .pipe(eslint())
        .pipe(eslint.results((results) => {
            console.log(`error count: ${results.errorCount}`);
            console.log(`warning count: ${results.warningCount}`);
        }));
});

gulp.task("default", ["lint", "test"], () => {
    // noting to do.
});
