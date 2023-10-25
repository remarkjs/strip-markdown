/// <reference types="./types.d.ts" />

/**
 * @typedef {import('mdast').PhrasingContent} PhrasingContent
 * @typedef {import('mdast-util-directive').TextDirective} TextDirective
 * @typedef {import('strip-markdown').Options} Options
 */

import assert from 'node:assert/strict'
import test from 'node:test'
import {remark} from 'remark'
import remarkDirective from 'remark-directive'
import remarkGfm from 'remark-gfm'
import stripMarkdown from 'strip-markdown'

test('stripMarkdown', async function (t) {
  await t.test('should expose the public api', async function () {
    assert.deepEqual(Object.keys(await import('strip-markdown')).sort(), [
      'default'
    ])
  })

  await t.test('should keep unknown nodes', async function () {
    assert.deepEqual(
      await remark()
        .use(stripMarkdown)
        .run({
          type: 'root',
          children: [
            {
              type: 'x',
              children: [
                {
                  type: 'strong',
                  children: [
                    {type: 'text', value: 'value'},
                    {type: 'y', value: 'with value'}
                  ]
                }
              ]
            }
          ]
        }),
      {
        type: 'root',
        children: [
          {
            type: 'x',
            children: [
              {type: 'text', value: 'value'},
              {type: 'y', value: 'with value'}
            ]
          }
        ]
      }
    )
  })

  await t.test('should support text', async function () {
    assert.equal(await proc('Alfred'), 'Alfred\n')
  })

  await t.test('should support emphasis (1)', async function () {
    assert.equal(await proc('*Alfred*'), 'Alfred\n')
  })

  await t.test('should support emphasis (2)', async function () {
    assert.equal(await proc('_Alfred_'), 'Alfred\n')
  })

  await t.test('should support strong (1)', async function () {
    assert.equal(await proc('**Alfred**'), 'Alfred\n')
  })

  await t.test('should support strong (2)', async function () {
    assert.equal(await proc('__Alfred__'), 'Alfred\n')
  })

  await t.test('should support strikethrough', async function () {
    assert.equal(await proc('~~Alfred~~'), 'Alfred\n')
  })

  await t.test('should support inline code', async function () {
    assert.equal(await proc('`Alfred`'), 'Alfred\n')
  })

  await t.test('should support a resource link', async function () {
    assert.equal(await proc('[Hello](world)'), 'Hello\n')
  })

  await t.test('should support strong in a link', async function () {
    assert.equal(await proc('[**H**ello](world)'), 'Hello\n')
  })

  await t.test('should support a reference/definition', async function () {
    assert.equal(
      await proc('[Hello][id]\n\n[id]: http://example.com "optional title"'),
      'Hello\n'
    )
  })

  await t.test('should support a paragraph', async function () {
    assert.equal(await proc('Hello.\n\nWorld.'), 'Hello.\n\nWorld.\n')
  })

  await t.test('should support a heading (atx)', async function () {
    assert.equal(await proc('## Alfred'), 'Alfred\n')
  })

  await t.test('should support heading (setext)', async function () {
    assert.equal(await proc('Alfred\n====='), 'Alfred\n')
  })

  await t.test('should support a list item', async function () {
    assert.equal(
      await proc('- Hello\n    * World\n        + !'),
      'Hello\n\nWorld\n\n!\n'
    )
  })

  await t.test('should support a list', async function () {
    assert.equal(
      await proc('- Hello\n\n- World\n\n- !'),
      'Hello\n\nWorld\n\n!\n'
    )
  })

  await t.test('should support a list item (empty)', async function () {
    assert.equal(await proc('- Hello\n- \n- World!'), 'Hello\n\nWorld!\n')
  })

  await t.test('should support a block quote', async function () {
    assert.equal(await proc('> Hello\n> World\n> !'), 'Hello\nWorld\n!\n')
  })

  await t.test('should support an image', async function () {
    assert.equal(await proc('![An image](image.png "test")'), 'An image\n')
  })

  await t.test('should support an image (no alt)', async function () {
    assert.equal(await proc('![](image.png "test")'), 'test\n')
  })

  await t.test('should support an image (no alt, no title)', async function () {
    assert.equal(await proc('![](image.png)'), '')
  })

  await t.test(
    'should support an image reference, definition',
    async function () {
      assert.equal(
        await proc('![An image][id]\n\n[id]: http://example.com/a.jpg'),
        'An image\n'
      )
    }
  )

  await t.test('should support a thematic break', async function () {
    assert.equal(await proc('---'), '')
  })

  await t.test('should support a hard break', async function () {
    assert.equal(await proc('A  \nB'), 'A\nB\n')
  })

  await t.test('should support a soft break', async function () {
    assert.equal(await proc('A\nB'), 'A\nB\n')
  })

  await t.test('should support a table', async function () {
    assert.equal(await proc('| A | B |\n| - | - |\n| C | D |'), '')
  })

  await t.test('should support code (indented)', async function () {
    assert.equal(await proc('\talert("hello");'), '')
  })

  await t.test('should support code (fenced)', async function () {
    assert.equal(await proc('```js\nconsole.log("world");\n```'), '')
  })

  await t.test('should support html (text)', async function () {
    assert.equal(await proc('<sup>Hello</sup>'), 'Hello\n')
  })

  await t.test('should support html (flow)', async function () {
    assert.equal(await proc('<script>alert("world");</script>'), '')
  })

  await t.test('should support html in an image', async function () {
    assert.equal(
      await proc(
        '[<img src="http://example.com/a.jpg" />](http://example.com)'
      ),
      ''
    )
  })

  await t.test('should support a footnote', async function () {
    assert.equal(await proc('Hello[^1]\n\n[^1]: World'), 'Hello\n')
  })

  await t.test('should support `options.keep` (empty)', async function () {
    // "keep" option
    assert.equal(
      await proc('- **Hello**\n\n- World!', {keep: []}),
      'Hello\n\nWorld!\n'
    )
  })

  await t.test('should support keeping lists', async function () {
    assert.equal(
      await proc('- **Hello**\n\n- World!', {keep: ['list', 'listItem']}),
      '* Hello\n\n* World!\n'
    )
  })

  await t.test(
    'should throw for unknown nodes in `keep` w/o handlers',
    async function () {
      try {
        await proc('- **Hello**\n\n- World!', {
          keep: [
            // @ts-expect-error: untyped node.
            'typo'
          ]
        })
        assert.fail()
      } catch (error) {
        assert.match(
          String(error),
          /Unknown node type `typo` in `keep`, use a replace tuple with a handle instead: `remove: \[\['typo', handle]]`/
        )
      }
    }
  )

  await t.test('should support `options.remove`', async function () {
    // "remove" option
    assert.equal(
      await proc('I read this :cite[smith04]!', {remove: ['textDirective']}),
      'I read this !\n'
    )
  })

  await t.test('should support callbacks in `remove`', async function () {
    assert.equal(
      await proc(
        'A :i[lovely] language known as :abbr[HTML]{title="HyperText Markup Language"}.',
        {
          remove: [
            [
              'textDirective',
              /**
               * @param {TextDirective} node
               *   Node.
               * @returns {Array<PhrasingContent> | PhrasingContent}
               *   Result.
               */
              function (node) {
                if (node.name === 'abbr') {
                  const value = String(node.attributes?.title || '')
                  if (value) {
                    return {type: 'text', value: String(node.attributes?.title)}
                  }
                }

                return node.children
              }
            ]
          ]
        }
      ),
      'A lovely language known as HyperText Markup Language.\n'
    )
  })
})

/**
 * @param {string} value
 *   Value.
 * @param {Options | null | undefined} [options]
 *   Configuration.
 * @returns {Promise<string>}
 *   Result.
 */
async function proc(value, options) {
  return String(
    await remark()
      .use(remarkGfm)
      .use(remarkDirective)
      .use(stripMarkdown, options)
      .process(value)
  )
}
