# strip-markdown

[![Build][build-badge]][build]
[![Coverage][coverage-badge]][coverage]
[![Downloads][downloads-badge]][downloads]
[![Chat][chat-badge]][chat]
[![Sponsors][sponsors-badge]][collective]
[![Backers][backers-badge]][collective]

Remove Markdown formatting with [**remark**][remark].  This essentially removes
everything but paragraphs and text nodes.

> This is one of the first remark plugins, before prefixing with
> `remark-` got cool.

## Installation

[npm][]:

```bash
npm install strip-markdown
```

## Usage

```javascript
var remark = require('remark')
var strip = require('strip-markdown')

remark()
  .use(strip)
  .process('Some _emphasis_, **importance**, and `code`.', function(err, file) {
    if (err) throw err
    console.log(String(file))
  })
```

Yields:

```text
Some emphasis, importance, and code.
```

## API

### `remark().use(strip)`

Modifies **remark** to expose plain-text.

*   Removes `html`, `code`, `horizontalRule`, `table`, `yaml`, `toml`, and their
    content
*   Render everything else as simple paragraphs without formatting
*   Uses `alt` text for images

## Contribute

See [`contributing.md` in `remarkjs/remark`][contributing] for ways to get
started.

This organisation has a [Code of Conduct][coc].  By interacting with this
repository, organisation, or community you agree to abide by its terms.

## License

[MIT][license] © [Titus Wormer][author]

<!-- Definitions -->

[build-badge]: https://img.shields.io/travis/remarkjs/strip-markdown.svg

[build]: https://travis-ci.org/remarkjs/strip-markdown

[coverage-badge]: https://img.shields.io/codecov/c/github/remarkjs/strip-markdown.svg

[coverage]: https://codecov.io/github/remarkjs/strip-markdown

[downloads-badge]: https://img.shields.io/npm/dm/strip-markdown.svg

[downloads]: https://www.npmjs.com/package/strip-markdown

[chat-badge]: https://img.shields.io/badge/join%20the%20community-on%20spectrum-7b16ff.svg

[chat]: https://spectrum.chat/unified/remark

[sponsors-badge]: https://opencollective.com/unified/sponsors/badge.svg

[backers-badge]: https://opencollective.com/unified/backers/badge.svg

[collective]: https://opencollective.com/unified

[npm]: https://docs.npmjs.com/cli/install

[license]: license

[author]: https://wooorm.com

[remark]: https://github.com/remarkjs/remark

[contributing]: https://github.com/remarkjs/remark/blob/master/contributing.md

[coc]: https://github.com/remarkjs/remark/blob/master/code-of-conduct.md
