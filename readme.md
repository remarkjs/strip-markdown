# strip-markdown [![Build Status][travis-badge]][travis] [![Coverage Status][codecov-badge]][codecov]

Remove Markdown formatting with [**remark**][remark].

This essentially removes everything but paragraphs and text nodes.

> This is one of the first remark plugins, before prefixing with
> `remark-` got cool.

## Installation

[npm][npm-install]:

```bash
npm install strip-markdown
```

## Usage

```javascript
var strip = require('strip-markdown');
var remark = require('remark');
var processor = remark().use(strip);

var file = processor.process('Some _emphasis_, **importance**, and `code`.');

console.log(String(file));
```

Yields:

```text
Some emphasis, importance, and code.
```

## API

### `remark().use(strip)`

Modifies **remark** to expose plain-text.

*   Removes `html`, `code`, `horizontalRule`, `table`, and their content;
*   Render everything else as simple paragraphs without formatting.
*   Uses `alt` text for images.

## License

[MIT][license] © [Titus Wormer][author]

<!-- Definitions -->

[travis-badge]: https://img.shields.io/travis/wooorm/strip-markdown.svg

[travis]: https://travis-ci.org/wooorm/strip-markdown

[codecov-badge]: https://img.shields.io/codecov/c/github/wooorm/strip-markdown.svg

[codecov]: https://codecov.io/github/wooorm/strip-markdown

[npm-install]: https://docs.npmjs.com/cli/install

[license]: LICENSE

[author]: http://wooorm.com

[remark]: https://github.com/wooorm/remark
