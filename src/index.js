/* eslint-env browser */
import unified from 'unified'
import parse from 'remark-parse'
import stringify from 'remark-stringify'
import strip from 'strip-markdown'

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
