/**
 * @typedef {import('unist').Node} Node
 * @typedef {import('mdast').RootContent} RootContent
 * @typedef {import('./index.js').Options} Options
 */

import assert from 'node:assert/strict'
import test from 'node:test'
import {remark} from 'remark'
import remarkGfm from 'remark-gfm'
import remarkDirective from 'remark-directive'
import {u} from 'unist-builder'
import stripMarkdown from './index.js'

test('stripMarkdown()', () => {
  assert.deepEqual(
    remark()
      .use(stripMarkdown)
      .runSync(
        // @ts-expect-error: custom nodes.
        u('root', [
          u('unknown', [u('strong', [u('text', 'value')])]),
          u('anotherUnknown', 'with value')
        ])
      ),
    u('root', [
      u('unknown', [u('text', 'value')]),
      u('anotherUnknown', 'with value')
    ]),
    'should keep unknown nodes'
  )

  assert.deepEqual(
    remark()
      .use(stripMarkdown)
      // @ts-expect-error: custom nodes.
      .runSync(u('root', [u('paragraph', [u('link')])])),
    u('root', [u('paragraph', [])]),
    'should keep unknown nodes'
  )

  assert.equal(proc('Alfred'), 'Alfred', 'text')
  assert.equal(proc('*Alfred*'), 'Alfred', 'emphasis (1)')
  assert.equal(proc('_Alfred_'), 'Alfred', 'emphasis (2)')
  assert.equal(proc('**Alfred**'), 'Alfred', 'importance (1)')
  assert.equal(proc('__Alfred__'), 'Alfred', 'importance (2)')
  assert.equal(proc('~~Alfred~~'), 'Alfred', 'strikethrough')
  assert.equal(proc('`Alfred`'), 'Alfred', 'inline code')
  assert.equal(proc('[Hello](world)'), 'Hello', 'link')
  assert.equal(proc('[**H**ello](world)'), 'Hello', 'importance in link')
  assert.equal(
    proc('[Hello][id]\n\n[id]: http://example.com "optional title"'),
    'Hello',
    'reference-style link'
  )
  assert.equal(proc('Hello.\n\nWorld.'), 'Hello.\n\nWorld.', 'paragraph')
  assert.equal(proc('## Alfred'), 'Alfred', 'headings (atx)')
  assert.equal(proc('Alfred\n====='), 'Alfred', 'headings (setext)')

  assert.equal(
    proc('- Hello\n    * World\n        + !'),
    'Hello\n\nWorld\n\n!',
    'list item'
  )

  assert.equal(proc('- Hello\n\n- World\n\n- !'), 'Hello\n\nWorld\n\n!', 'list')

  assert.equal(
    proc('- Hello\n- \n- World!'),
    'Hello\n\nWorld!',
    'empty list item'
  )

  assert.equal(proc('> Hello\n> World\n> !'), 'Hello\nWorld\n!', 'blockquote')

  assert.equal(proc('![An image](image.png "test")'), 'An image', 'image (1)')
  assert.equal(proc('![](image.png "test")'), 'test', 'image (2)')
  assert.equal(proc('![](image.png)'), '', 'image (3)')
  assert.equal(
    proc('![An image][id]\n\n[id]: http://example.com/a.jpg'),
    'An image',
    'reference-style image'
  )

  assert.equal(proc('---'), '', 'thematic break')
  assert.equal(proc('A  \nB'), 'A\nB', 'hard line break')
  assert.equal(proc('A\nB'), 'A\nB', 'soft line break')
  assert.equal(proc('| A | B |\n| - | - |\n| C | D |'), '', 'table')
  assert.equal(proc('\talert("hello");'), '', 'code (1)')
  assert.equal(proc('```js\nconsole.log("world");\n```'), '', 'code (2)')
  assert.equal(proc('<sup>Hello</sup>'), 'Hello', 'html (1)')
  assert.equal(proc('<script>alert("world");</script>'), '', 'html (2)')
  assert.equal(
    proc('[<img src="http://example.com/a.jpg" />](http://example.com)'),
    '',
    'html (3)'
  )

  assert.equal(proc('Hello[^1]\n\n[^1]: World'), 'Hello', 'footnote')

  // "keep" option
  assert.equal(
    proc('- **Hello**\n\n- World!', {keep: []}),
    'Hello\n\nWorld!',
    'empty array as `keep` option'
  )
  assert.equal(
    proc('- **Hello**\n\n- World!', {keep: ['list', 'listItem']}),
    '* Hello\n\n* World!',
    'keep lists'
  )
  assert.throws(
    () => {
      // @ts-expect-error: custom node.
      proc('- **Hello**\n\n- World!', {keep: ['typo']})
    },
    /Error: Invalid `keep` option/,
    'invalid `keep` option'
  )

  // "remove" option
  assert.equal(
    // @ts-expect-error: textDirective from mdast-util-directive.
    proc('I read this :cite[smith04]!', {remove: ['textDirective']}),
    'I read this !',
    'remove directive'
  )
  assert.equal(
    proc(
      'A :i[lovely] language known as :abbr[HTML]{title="HyperText Markup Language"}.',
      {
        remove: [
          // @ts-expect-error: textDirective from mdast-util-directive.
          [
            'textDirective',
            (
              /** @type {Node & {children: RootContent[], name: string, attributes: Record<string, string>}} */ node
            ) => {
              if (node.name === 'abbr') {
                return {type: 'text', value: node.attributes.title}
              }

              return node.children
            }
          ]
        ]
      }
    ),
    'A lovely language known as HyperText Markup Language.',
    'replace directive'
  )
})

/**
 * @param {string} value
 * @param {Options|undefined} [options]
 * @returns {string}
 */
function proc(value, options) {
  return (
    remark()
      .use(remarkGfm)
      .use(remarkDirective)
      // @ts-expect-error: to do: fix types.
      .use(stripMarkdown, options)
      .processSync(value)
      .toString()
      .trimEnd()
  )
}
