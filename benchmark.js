'use strict';

/* globals suite, bench */

/*
 * Dependencies.
 */

var fs = require('fs');
var summarize = require('summarize-markdown');
var stripMarkdown = require('./');
var mdast = require('mdast');

/*
 * Processor.
 */

var processor = mdast.use(stripMarkdown);

/*
 * Fixtures.
 */

var fixture = fs.readFileSync('Readme.md', 'utf-8');

/**
 * Wrapper for `strip-markdown`.
 *
 * @param {string} value
 * @return {string}
 */
function strip(value) {
    return processor.process(value);
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
