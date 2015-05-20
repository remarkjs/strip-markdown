// Require dependencies:
var strip = require('./index.js');
var mdast = require('mdast').use(strip);

// Process markdown:
var doc = mdast.process('Some *emphasis*, **strongness**, and `code`.');

// Yields:
console.log('text', doc);
