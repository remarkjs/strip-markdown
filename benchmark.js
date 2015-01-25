'use strict';

/*
 * Dependencies.
 */

var stripMarkdown,
    summarize,
    fs,
    mdast;

stripMarkdown = require('./');
summarize = require('summarize-markdown');
fs = require('fs');

mdast = require('mdast').use(stripMarkdown);

/*
 * Fixtures.
 */

var fixture;

fixture = fs.readFileSync('Readme.md', 'utf-8');

/**
 * Wrapper for `strip-markdown`.
 *
 * @param {string} value
 * @return {string}
 */
function strip(value) {
    return mdast.stringify(mdast.parse(value));
}

/*
 * Benchmark.
 */

suite('This project\'s `Readme.md`', function () {
    bench('strip-markdown -- this module', function () {
        strip(fixture);
    });

    bench('summarize-markdown', function () {
        summarize(fixture);
    });
});
