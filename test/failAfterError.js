const assert = require("assert");
const File = require("vinyl");
const gulpSolium = require("../");
require("mocha");

describe("failAfterError", () => {
    describe("error", () => {
        it("basic test", (done) => {
            const fakeOption = {
                "rules": {
                    "quotes": ["error", "double"]
                },
                "options": { "returnInternalIssues": true }
            };

            const fakeFile = new File({
                contents: Buffer.from("contract Foo { string hello = 'god-bye'; }") // strings with single quote
            });

            const solium = gulpSolium();

            solium.pipe(gulpSolium.failAfterError()
                .on("error", (err) => {
                    assert.equal(err.message, "Failed with 1 error(s)");
                    done();
                }));

            solium.write(fakeFile);
            solium.end();
        });

        it("no error & wraning", (done) => {
            const solium = gulpSolium();

            solium.pipe(gulpSolium.failAfterError()
                .on("error", done)
                .on("finish", done));

            solium.write(new File({
                contents: Buffer.from("pragma solidity ^4.0.0;") // correct source code
            }));
            solium.end();
        });
    });
});
