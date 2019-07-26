'use strict'

/* eslint-env browser */

var unified = require('unified')
var parse = require('remark-parse')
var stringify = require('remark-stringify')
var strip = require('strip-markdown')

var processor = unified()
  .use(parse)
  .use(stringify)
  .use(strip)

var $input = document.querySelector('[autofocus]')
var $output = document.querySelector('[readonly]')

$input.addEventListener('input', oninputchange)

oninputchange()

function oninputchange() {
  $output.textContent = processor.processSync($input.value).toString()
}
