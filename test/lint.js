const assert = require("assert");
const File = require("vinyl");
const gulpSolium = require("../");
require("mocha");

describe("lint", () => {
    describe("lint error", () => {
        // fake file
        const fakeFile = new File({
            contents: Buffer.from("contract fOO_bar { uint hola = 1; }") // incorrect source code
        });

        it("basic test", (done) => {
            const fakeOption = {
                "extends": "solium:recommended",
                "rules": {
                    "quotes": ["error", "double"],
                    "pragma-on-top": 1
                },
                "options": { "returnInternalIssues": true }
            };

            const solium = gulpSolium(fakeOption);
            solium.write(fakeFile);

            solium.once("data", (file) => {
                // Assert
                assert(file.isBuffer());
                assert.equal(file.solium[0].ruleName, "pragma-on-top");
                assert.equal(file.solium[1].ruleName, "indentation");
                done();
            });
        });

        it("without options", (done) => {
            // Act
            const solium = gulpSolium(); // without options
            solium.write(fakeFile);

            solium.once("data", (file) => {
                assert(file.isBuffer());
                assert.equal(file.solium[0].ruleName, "pragma-on-top");
                assert.equal(file.solium[1].ruleName, "indentation");
                done();
            });
        });
    });

    describe("invalid input", () => {
        it("invalid option", (done) => {
            const invalidOption = {
                "foo": "bar"
            };
            assert.throws(() => {
                gulpSolium(invalidOption);
                done();
            });
        });

        it("syntax error of Solidity", (done) => {
            const solium = gulpSolium({
                "extends": "solium:recommended",
                "options": { "returnInternalIssues": true }
            });

            const invalidFile = new File({
                contents: Buffer.from("pragma solidity ^4.0.0") // missing semicolon
            });

            assert.throws(() => {
                solium.write(invalidFile, (err) => {
                    assert.equal(err.name, "SyntaxError");
                    done();
                });
            });
        });
    });

    describe("no lint error", () => {
        it("no warning & error", (done) => {
            // fake file
            const fakeFile = new File({
                contents: Buffer.from("pragma solidity ^4.0.0;") // correct source code
            });

            // Act
            const solium = gulpSolium();
            solium.write(fakeFile);

            solium.once("data", (file) => {
                // Assert
                assert.equal(file.solium.length, 0);
                done();
            });
        });
    });
});
