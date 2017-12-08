# strip-markdown [![Build Status][travis-badge]][travis] [![Coverage Status][codecov-badge]][codecov]

Remove Markdown formatting with [**remark**][remark].

This essentially removes everything but paragraphs and text nodes.

> This is one of the first remark plugins, before prefixing with
> `remark-` got cool.

## Installation

[npm][]:

```bash
npm install strip-markdown
```

## Usage

```javascript
var remark = require('remark');
var strip = require('strip-markdown');

remark()
  .use(strip)
  .process('Some _emphasis_, **importance**, and `code`.', function (err, file) {
    if (err) throw err;
    console.log(String(file));
  });
```

Yields:

```text
Some emphasis, importance, and code.
```

## API

### `remark().use(strip)`

Modifies **remark** to expose plain-text.

*   Removes `html`, `code`, `horizontalRule`, `table`, and their content
*   Render everything else as simple paragraphs without formatting
*   Uses `alt` text for images

## License

[MIT][license] © [Titus Wormer][author]

<!-- Definitions -->

[travis-badge]: https://img.shields.io/travis/remarkjs/strip-markdown.svg

[travis]: https://travis-ci.org/remarkjs/strip-markdown

[codecov-badge]: https://img.shields.io/codecov/c/github/remarkjs/strip-markdown.svg

[codecov]: https://codecov.io/github/remarkjs/strip-markdown

[npm]: https://docs.npmjs.com/cli/install

[license]: LICENSE

[author]: http://wooorm.com

[remark]: https://github.com/remarkjs/remark
