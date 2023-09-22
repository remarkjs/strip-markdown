/**
 * @typedef {import('unist').Node} Node
 * @typedef {import('mdast').Content} Content
 * @typedef {import('./index.js').Options} Options
 */

import test from 'tape'
import {remark} from 'remark'
import remarkGfm from 'remark-gfm'
import remarkDirective from 'remark-directive'
import {u} from 'unist-builder'
import stripMarkdown from './index.js'

/**
 * @param {string} value
 * @param {Options|undefined} [options]
 * @returns {string}
 */
function proc(value, options) {
  return remark()
    .use(remarkGfm)
    .use(remarkDirective)
    .use(stripMarkdown, options)
    .processSync(value)
    .toString()
    .trimEnd()
}

test('stripMarkdown()', (t) => {
  t.deepEqual(
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

  t.deepEqual(
    remark()
      .use(stripMarkdown)
      // @ts-expect-error: custom nodes.
      .runSync(u('root', [u('paragraph', [u('link')])])),
    u('root', [u('paragraph', [])]),
    'should keep unknown nodes'
  )

  t.equal(proc('Alfred'), 'Alfred', 'text')
  t.equal(proc('*Alfred*'), 'Alfred', 'emphasis (1)')
  t.equal(proc('_Alfred_'), 'Alfred', 'emphasis (2)')
  t.equal(proc('**Alfred**'), 'Alfred', 'importance (1)')
  t.equal(proc('__Alfred__'), 'Alfred', 'importance (2)')
  t.equal(proc('~~Alfred~~'), 'Alfred', 'strikethrough')
  t.equal(proc('`Alfred`'), 'Alfred', 'inline code')
  t.equal(proc('[Hello](world)'), 'Hello', 'link')
  t.equal(proc('[**H**ello](world)'), 'Hello', 'importance in link')
  t.equal(
    proc('[Hello][id]\n\n[id]: http://example.com "optional title"'),
    'Hello',
    'reference-style link'
  )
  t.equal(proc('Hello.\n\nWorld.'), 'Hello.\n\nWorld.', 'paragraph')
  t.equal(proc('## Alfred'), 'Alfred', 'headings (atx)')
  t.equal(proc('Alfred\n====='), 'Alfred', 'headings (setext)')

  t.equal(
    proc('- Hello\n    * World\n        + !'),
    'Hello\n\nWorld\n\n!',
    'list item'
  )

  t.equal(proc('- Hello\n\n- World\n\n- !'), 'Hello\n\nWorld\n\n!', 'list')

  t.equal(proc('- Hello\n- \n- World!'), 'Hello\n\nWorld!', 'empty list item')

  t.equal(proc('> Hello\n> World\n> !'), 'Hello\nWorld\n!', 'blockquote')

  t.equal(proc('![An image](image.png "test")'), 'An image', 'image (1)')
  t.equal(proc('![](image.png "test")'), 'test', 'image (2)')
  t.equal(proc('![](image.png)'), '', 'image (3)')
  t.equal(
    proc('![An image][id]\n\n[id]: http://example.com/a.jpg'),
    'An image',
    'reference-style image'
  )

  t.equal(proc('---'), '', 'thematic break')
  t.equal(proc('A  \nB'), 'A\nB', 'hard line break')
  t.equal(proc('A\nB'), 'A\nB', 'soft line break')
  t.equal(proc('| A | B |\n| - | - |\n| C | D |'), '', 'table')
  t.equal(proc('\talert("hello");'), '', 'code (1)')
  t.equal(proc('```js\nconsole.log("world");\n```'), '', 'code (2)')
  t.equal(proc('<sup>Hello</sup>'), 'Hello', 'html (1)')
  t.equal(proc('<script>alert("world");</script>'), '', 'html (2)')
  t.equal(
    proc('[<img src="http://example.com/a.jpg" />](http://example.com)'),
    '',
    'html (3)'
  )

  t.equal(proc('Hello[^1]\n\n[^1]: World'), 'Hello', 'footnote')

  // "keep" option
  t.equal(
    proc('- **Hello**\n\n- World!', {keep: []}),
    'Hello\n\nWorld!',
    'empty array as `keep` option'
  )
  t.equal(
    proc('- **Hello**\n\n- World!', {keep: ['list', 'listItem']}),
    '* Hello\n\n* World!',
    'keep lists'
  )
  t.throws(
    () => {
      // @ts-expect-error: custom node.
      proc('- **Hello**\n\n- World!', {keep: ['typo']})
    },
    /Error: Invalid `keep` option/,
    'invalid `keep` option'
  )

  // "remove" option
  t.equal(
    // @ts-expect-error: textDirective from mdast-util-directive.
    proc('I read this :cite[smith04]!', {remove: ['textDirective']}),
    'I read this !',
    'remove directive'
  )
  t.equal(
    proc(
      'A :i[lovely] language known as :abbr[HTML]{title="HyperText Markup Language"}.',
      {
        remove: [
          // @ts-expect-error: textDirective from mdast-util-directive.
          [
            'textDirective',
            (
              /** @type {Node & {children: Content[], name: string, attributes: Record<string, string>}} */ node
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

  t.end()
})
