# strip-markdown [![Build Status](https://img.shields.io/travis/wooorm/strip-markdown.svg?style=flat)](https://travis-ci.org/wooorm/strip-markdown) [![Coverage Status](https://img.shields.io/coveralls/wooorm/strip-markdown.svg?style=flat)](https://coveralls.io/r/wooorm/strip-markdown?branch=master)

Remove [Markdown](http://daringfireball.net/projects/markdown/syntax) formatting with [mdast](https://github.com/wooorm/mdast).

## Installation

[npm](https://docs.npmjs.com/cli/install):

```bash
$ npm install strip-markdown
```

[Component.js](https://github.com/componentjs/component):

```bash
$ component install wooorm/strip-markdown
```

[Bower](http://bower.io/#install-packages):

```bash
$ bower install strip-markdown
```

[Duo](http://duojs.org/#getting-started):

```javascript
var stripMarkdown = require('wooorm/strip-markdown');
```

UMD (globals/AMD/CommonJS) ([uncompressed](strip-markdown.js) and [compressed](strip-markdown.min.js)):

```html
<script src="path/to/mdast.js"></script>
<script src="path/to/strip-markdown.js"></script>
<script>
  mdast.use(stripMarkdown).process('Remove [Markdown](http://daringfireball.net/projects/markdown/syntax) formatting with [mdast](https://github.com/wooorm/mdast).');
  // "Remove Markdown formatting with mdast."
</script>
```

## Usage

Require dependencies:

```javascript
var strip = require('strip-markdown');
var mdast = require('mdast').use(strip);
```

Process markdown:

```javascript
var doc = mdast.process('Some *emphasis*, **strongness**, and `code`.');
```

Yields:

```text
Some emphasis, strongness, and code.
```

## API

### [mdast](https://github.com/wooorm/mdast#api).[use](https://github.com/wooorm/mdast#mdastuseplugin)(stripMarkdown)

Modifies **mdast** to expose simple plain-text.

*   Removes `html`, `code`, `horizontalRule`, `table`, and their content;
*   Render everything else as simple paragraphs without formatting.

## Benchmark

It’s pretty fast. Slower than **summarize-markdown**, but a lot cooler (such as supporting images and more).

```text
           This project's `Readme.md`
  801 op/s » strip-markdown -- this module
2,382 op/s » summarize-markdown
```

## License

[MIT](LICENSE) © [Titus Wormer](http://wooorm.com)
