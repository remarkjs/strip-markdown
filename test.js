/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @module strip-markdown
 * @fileoverview Test suite for `strip-markdown`.
 */

'use strict';

/* Dependencies. */
var test = require('tape');
var remark = require('remark');
var strip = require('./');

function proc(value) {
  return remark().use(strip).process(value).toString().trimRight();
}

/* API. */
test('stripMarkdown()', function (t) {
  t.equal(proc('Alfred'), 'Alfred', 'text');
  t.equal(proc('*Alfred*'), 'Alfred', 'emphasis (1)');
  t.equal(proc('_Alfred_'), 'Alfred', 'emphasis (2)');
  t.equal(proc('**Alfred**'), 'Alfred', 'importance (1)');
  t.equal(proc('__Alfred__'), 'Alfred', 'importance (2)');
  t.equal(proc('~~Alfred~~'), 'Alfred', 'strikethrough');
  t.equal(proc('`Alfred`'), 'Alfred', 'inline code');
  t.equal(proc('[Hello](world)'), 'Hello', 'link');
  t.equal(proc('[**H**ello](world)'), 'Hello', 'importance in link');
  t.equal(proc('Hello.\n\nWorld.'), 'Hello.\n\nWorld.', 'paragraph');
  t.equal(proc('## Alfred'), 'Alfred', 'headings (atx)');
  t.equal(proc('Alfred\n====='), 'Alfred', 'headings (setext)');

  t.equal(
    proc('- Hello\n    * World\n        + !'),
    'Hello\n\nWorld\n\n!',
    'list item'
  );

  t.equal(
    proc('- Hello\n\n- World\n\n- !'),
    'Hello\n\nWorld\n\n!',
    'list'
  );

  t.equal(
    proc('> Hello\n> World\n> !'),
    'Hello\nWorld\n!',
    'blockquote'
  );

  t.equal(proc('![An image](image.png "test")'), 'An image', 'image (1)');
  t.equal(proc('![](image.png "test")'), 'test', 'image (2)');
  t.equal(proc('![](image.png)'), '', 'image (3)');

  t.equal(proc('---'), '', 'thematic break');
  t.equal(proc('| A | B |\n| - | - |\n| C | D |'), '', 'table');
  t.equal(proc('\talert("hello");'), '', 'code (1)');
  t.equal(proc('```js\nconsole.log("world");\n```'), '', 'code (2)');
  t.equal(proc('<sup>Hello</sup>'), 'Hello', 'html (1)');
  t.equal(proc('<script>alert("world");</script>'), '', 'html (2)');

  t.end();
});
