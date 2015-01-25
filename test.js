'use strict';

/*
 * Dependencies.
 */

var stripMarkdown,
    mdast,
    assert;

stripMarkdown = require('./');
mdast = require('mdast');
assert = require('assert');

/**
 * Shortcut to process markdown to text.
 *
 * @param {string} value
 * @return {string}
 */
function strip(value) {
    return mdast.stringify(mdast.use(stripMarkdown).parse(value)).trimRight();
}

/*
 * Tests.
 */

describe('strip-markdown()', function () {
    it('should be a function', function () {
        assert(typeof stripMarkdown === 'function');
    });

    it('should throw if not passed a node', function () {
        assert.throws(function () {
            stripMarkdown(true);
        });
    });

    it('should stringify text', function () {
        assert(strip('Alfred') === 'Alfred');
    });

    it('should stringify paragraphs', function () {
        assert(strip('Hello.\n\nWorld.') === 'Hello.\n\nWorld.');
    });

    it('should strip emphasis with asterisks', function () {
        assert(strip('*Alfred*') === 'Alfred');
    });

    it('should strip emphasis with underscores', function () {
        assert(strip('_Alfred_') === 'Alfred');
    });

    it('should strip strong emphasis with asterisks', function () {
        assert(strip('**Alfred**') === 'Alfred');
    });

    it('should strip strong emphasis with underscores', function () {
        assert(strip('__Alfred__') === 'Alfred');
    });

    it('should strip a deletion', function () {
        assert(strip('~~Alfred~~') === 'Alfred');
    });

    it('should strip inline code', function () {
        assert(strip('`Alfred`') === 'Alfred');
    });

    it('should strip a link', function () {
        assert(strip('[Hello](world)') === 'Hello');
    });

    it('should strip formatting in a link', function () {
        assert(strip('[**H**ello](world)') === 'Hello');
    });

    it('should strip headings', function () {
        assert(strip('## Hello ##\n\nWorld\n-----') === 'Hello\n\nWorld');
    });

    it('should strip list items', function () {
        assert(
            strip('- Hello\n    * World\n        + !') ===
            'Hello\n\nWorld\n\n!'
        );
    });

    it('should strip lists', function () {
        assert(strip('- Hello\n\n- World\n\n- !') === 'Hello\n\nWorld\n\n!');
    });

    it('should strip blockquotes', function () {
        assert(strip('> Hello\n> World\n> !') === 'Hello\nWorld\n!');
    });

    it('should strip images', function () {
        assert(strip('![An image](image.png "test")') === 'An image');
        assert(strip('![](image.png "test")') === 'test');
        assert(strip('![](image.png)') === '');
    });

    it('should ignore horizontal rules', function () {
        assert(strip('Test\n\n---\n\nTest') === 'Test\n\nTest');
    });

    it('should ignore tables', function () {
        assert(strip('| Hello |\n| ----- |\n| World |') === '');
    });

    it('should ignore code', function () {
        assert(
            strip(
                '\talert("hello");\n\n```js\nconsole.log("world");\n```'
            ) === ''
        );
    });

    it('should ignore html', function () {
        assert(
            strip(
                '<sup>Hello</sup>\n<script>alert("world");</script>'
            ) === 'Hello'
        );
    });
});
