# strip-markdown

[![Build][build-badge]][build]
[![Coverage][coverage-badge]][coverage]
[![Downloads][downloads-badge]][downloads]
[![Size][size-badge]][size]
[![Sponsors][sponsors-badge]][collective]
[![Backers][backers-badge]][collective]
[![Chat][chat-badge]][chat]

**[remark][]** plugin to remove markdown formatting.
This essentially removes everything but paragraphs and text.

> This is one of the first remark plugins, before prefixing with `remark-` got
> cool.

## Contents

* [What is this?](#what-is-this)
* [When should I use this?](#when-should-i-use-this)
* [Install](#install)
* [Use](#use)
* [API](#api)
  * [`unified().use(stripMarkdown[, options])`](#unifiedusestripmarkdown-options)
  * [`Handler`](#handler)
  * [`Options`](#options)
* [Types](#types)
* [Compatibility](#compatibility)
* [Security](#security)
* [Contribute](#contribute)
* [License](#license)

## What is this?

This package is a [unified][] ([remark][]) plugin to remove most nodes so as to
just leave text.

## When should I use this?

You can use this if you want to ignore the syntax of markdown.

## Install

This package is [ESM only][esm].
In Node.js (version 16+), install with [npm][]:

```sh
npm install strip-markdown
```

In Deno with [`esm.sh`][esmsh]:

```js
import stripMarkdown from 'https://esm.sh/strip-markdown@5'
```

In browsers with [`esm.sh`][esmsh]:

```html
<script type="module">
  import stripMarkdown from 'https://esm.sh/strip-markdown@5?bundle'
</script>
```

## Use

```js
import {remark} from 'remark'
import strip from 'strip-markdown'

const file = await remark()
  .use(strip)
  .process('Some *emphasis*, **importance**, and `code`.')

console.log(String(file))
```

Yields:

```txt
Some emphasis, importance, and code.
```

## API

This package exports no identifiers.
The default export is [`stripMarkdown`][api-strip-markdown].

### `unified().use(stripMarkdown[, options])`

Remove markdown formatting.

* remove `code`, `html`, `horizontalRule`, `table`, `toml`, `yaml`, and
  their content
* render everything else as simple paragraphs without formatting
* uses `alt` text for images

###### Parameters

* `option` ([`Options`][api-options], optional)
  — configuration

###### Returns

Transform ([`Transformer`][unified-transformer]).

### `Handler`

Transform a node (TypeScript type).

###### Parameters

* `node` ([`Node`][mdast-node])
  — node

###### Returns

Result (`Array<Node>` or `Node`).

### `Options`

Configuration (TypeScript type).

###### Fields

* `keep` (`Array<string>`, optional)
  — list of node types to leave unchanged
* `remove` (`Array<[string, Handler] | string>`, optional)
  — list of node types to remove (or replace, with handlers)

## Types

This package is fully typed with [TypeScript][].
It exports the additional types [`Handler`][api-handler] and
[`Options`][api-options].

## Compatibility

Projects maintained by the unified collective are compatible with maintained
versions of Node.js.

When we cut a new major release, we drop support for unmaintained versions of
Node.
This means we try to keep the current release line, `strip-markdown@5`,
compatible with Node.js 12.

## Security

Use of `strip-markdown` does not involve **[rehype][]** (**[hast][]**) or user
content so there are no openings for [cross-site scripting (XSS)][xss] attacks.

## Contribute

See [`contributing.md`][contributing] in [`remarkjs/.github`][health] for ways
to get started.
See [`support.md`][support] for ways to get help.

This project has a [code of conduct][coc].
By interacting with this repository, organization, or community you agree to
abide by its terms.

## License

[MIT][license] © [Titus Wormer][author]

<!-- Definitions -->

[build-badge]: https://github.com/remarkjs/strip-markdown/workflows/main/badge.svg

[build]: https://github.com/remarkjs/strip-markdown/actions

[coverage-badge]: https://img.shields.io/codecov/c/github/remarkjs/strip-markdown.svg

[coverage]: https://codecov.io/github/remarkjs/strip-markdown

[downloads-badge]: https://img.shields.io/npm/dm/strip-markdown.svg

[downloads]: https://www.npmjs.com/package/strip-markdown

[size-badge]: https://img.shields.io/bundlejs/size/strip-markdown

[size]: https://bundlejs.com/?q=strip-markdown

[sponsors-badge]: https://opencollective.com/unified/sponsors/badge.svg

[backers-badge]: https://opencollective.com/unified/backers/badge.svg

[collective]: https://opencollective.com/unified

[chat-badge]: https://img.shields.io/badge/chat-discussions-success.svg

[chat]: https://github.com/remarkjs/remark/discussions

[npm]: https://docs.npmjs.com/cli/install

[esm]: https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c

[esmsh]: https://esm.sh

[health]: https://github.com/remarkjs/.github

[contributing]: https://github.com/remarkjs/.github/blob/main/contributing.md

[support]: https://github.com/remarkjs/.github/blob/main/support.md

[coc]: https://github.com/remarkjs/.github/blob/main/code-of-conduct.md

[xss]: https://en.wikipedia.org/wiki/Cross-site_scripting

[license]: license

[author]: https://wooorm.com

[hast]: https://github.com/syntax-tree/hast

[mdast-node]: https://github.com/syntax-tree/mdast#nodes

[rehype]: https://github.com/rehypejs/rehype

[remark]: https://github.com/remarkjs/remark

[typescript]: https://www.typescriptlang.org

[unified]: https://github.com/unifiedjs/unified

[unified-transformer]: https://github.com/unifiedjs/unified#transformer

[api-handler]: #handler

[api-options]: #options

[api-strip-markdown]: #unifiedusestripmarkdown-options
