/* eslint-env browser */
import {unified} from 'unified'
import remarkParse from 'remark-parse'
import remarkStringify from 'remark-stringify'
import stripMarkdown from 'strip-markdown'

var processor = unified()
  .use(remarkParse)
  .use(remarkStringify)
  .use(stripMarkdown)

var $input = document.querySelector('[autofocus]')
var $output = document.querySelector('[readonly]')

$input.addEventListener('input', oninputchange)

oninputchange()

function oninputchange() {
  $output.textContent = processor.processSync($input.value).toString()
}
