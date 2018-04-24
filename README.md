# gulp-solium
gulp plugin for solium.
I refered to [gulp-eslint](https://www.npmjs.com/package/gulp-eslint).

## Installation

```sh
npm install gulp-solium --save-dev
```

## Usage

```javascript
const gulp = require("gulp");
const solium = require("gulp-solium");

gulp.task("solium", () => {
    // gulp-solium don't honor .soliumignore file.
    // Instead of .soliumignore, please use !path.
    return gulp.src(["contracts/**/*.sol","!node_modules/**"])
        // if you don't pass settings, gulp-solium use .soliumrc.json or default settings.
        .pipe(solium())
        .pipe(solium.failAfterError());
});

gulp.task("default", ["solium"], () => {
    // This will only run if the lint task is successful...
});
```

## API

### solium()
A `.soliumrc.json` file may be resolved relative to each linted file.
If there isn't `.soliumrc.json` file, gulp-solium use following settings:

```json
{
    "extends": "solium:recommended",
    "options": { "returnInternalIssues": true }
}
```

### solium(options)
Set object of [rules](http://solium.readthedocs.io/en/latest/user-guide.html#list-of-style-rules).

```json
{
  "extends": "solium:recommended",
  "rules": {
    "quotes": ["error", "double"],
    "indentation": ["error", 4]
  }
}
```

### solium.results(action)

Call a function once for all Solium file results before a stream finishes. No returned value is expected.

```javascript
gulp.src(["contracts/**/*.sol","!node_modules/**"])
	.pipe(solium())
	.pipe(solium.results((results) => {
    	// Called once for all ESLint results.
	    console.log(`Total Results: ${results.length}`);
	    console.log(`Total Warnings: ${results.warningCount}`);
	    console.log(`Total Errors: ${results.errorCount}`);
	}));
```

### solium.failAfterError()

Stop a task/stream if an Solium error has been reported for any file, but wait for all of them to be processed first.

```javascript
gulp.src(["contracts/**/*.sol","!node_modules/**"])
	.pipe(eslint())
	.pipe(eslint.failAfterError());
```

## Lisence
[MIT](License)