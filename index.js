const through = require("through2");
const PluginError = require("plugin-error");
const Solium = require("solium");
const path = require("path");
const process = require("process");
const flatten = require("array-flatten");
const fs = require("fs");

const PLUGIN_NAME = "gulp-solium";

/**
 * Append Solium result to each file
 *
 * @param {Object} [userSettings] Configure rules for running Solium
 * @returns {Stream} gulp file stream
 */
function gulpSolium(userSettings) {
    return through.obj((file, encoding, callback) => {

        if (file.isNull()) {
            // nothing to do
            return callback(null, file);
        }
        if (file.isStream()) {
            callback(new PluginError(PLUGIN_NAME, `${PLUGIN_NAME} doesn't support vinyl files with Stream contents.`));
        }

        if (file.isBuffer()) {

            const soliumrcPath = path.join(process.cwd(), ".soliumrc.json");
            let options = {};

            if (userSettings) {
                options = userSettings;
            } else if (fs.existsSync(soliumrcPath)) {
                options = fs.readFileSync(soliumrcPath, { encoding: "UTF-8" });
            } else {
                options = {
                    "extends": "solium:recommended",
                    "options": { "returnInternalIssues": true }
                };
            }

            try {
                file.solium = Solium.lint(file.contents, options);
            } catch (err) {
                callback(new PluginError(PLUGIN_NAME, err));
            }
        }

        callback(null, file);
    });
}

/**
* Handle all Solium results at the end of the stream.
*
* @param {Function} action - A function to handle all Solium results
* @returns {stream} gulp file stream
*/
gulpSolium.results = (action) => {
    if (typeof action !== "function") {
        throw new Error("Expected callable argument");
    }

    let results = [];
    let errorCount = 0;
    let warningCount = 0;

    return through.obj((file, enc, done) => {
        if (file.solium) {
            results.push(file.solium);
            // count error & warning
            file.solium.forEach(value => {
                switch (value.type) {
                    case "error":
                        errorCount++;
                        break;
                    case "warning":
                        warningCount++;
                        break;
                    default:
                        break;
                }
            });
        }

        results = flatten(results);
        results.errorCount = errorCount;
        results.warningCount = warningCount;

        done(null, file);

    }, (done) => {
        try {
            if (action.length > 1) {
                // async action
                action.call(this, results, done);
            } else {
                // sync action
                action.call(this, results);
                done();
            }
        } catch (error) {
            done(error == null ? new Error("Unknown Error") : error);
        }
    });
};

/**
 * Fail when the stream ends if any Solium error(s) occurred
 *
 * @returns {stream} gulp file stream
 */
gulpSolium.failAfterError = () => {
    return gulpSolium.results((results) => {
        const count = results.errorCount;
        if (!count) {
            return;
        }

        throw new PluginError(PLUGIN_NAME, `Failed with ${count} error(s)`);
    });
};

module.exports = gulpSolium;
