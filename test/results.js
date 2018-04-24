const assert = require("assert");
const File = require("vinyl");
const gulpSolium = require("../");
require("mocha");

describe("results", () => {
    describe("single file", () => {
        it("basic test", (done) => {
            const solium = gulpSolium();

            solium.pipe(gulpSolium.results((results) => {
                assert.equal(results.warningCount, 2);
                assert.equal(results.errorCount, 0);
            }))
                .on("finish", () => {
                    done();
                });

            solium.write(new File({
                contents: Buffer.from("contract fOO_bar { uint hola = 1; }") // incorrect source code
            }));

            solium.end();
        });

        it("multi files", (done) => {
            const solium = gulpSolium();

            solium.pipe(gulpSolium.results((results) => {
                assert.equal(results.warningCount, 4);
                assert.equal(results[0].ruleName, "pragma-on-top");
            }))
                .on("finish", () => {
                    done();
                });

            solium.write(new File({
                contents: Buffer.from("contract fOO_bar { uint hola = 1; }") // incorrect source code
            }));

            solium.write(new File({
                contents: Buffer.from("pragma solidity ^4.0.0;    contract bar {}") // incorrect source code
            }));

            solium.end();
        });

        it("no error & wraning", (done) => {
            const solium = gulpSolium();

            solium.pipe(gulpSolium.results((results) => {
                assert.equal(results.warningCount, 0);
                assert.equal(results.errorCount, 0);
            }))
                .on("finish", () => {
                    done();
                });

            solium.write(new File({
                contents: Buffer.from("pragma solidity ^4.0.0;") // correct source code
            }));
            solium.end();
        });
    });
});
