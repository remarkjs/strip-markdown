// Require dependencies:
var strip = require('./index.js');
var mdast = require('mdast').use(strip);

// Parse markdown and stringify to text:
var ast = mdast.parse('Some *emphasis*, **strongness**, and `code`.');
var doc = mdast.stringify(ast);

// Yields:
console.log('text', doc);
