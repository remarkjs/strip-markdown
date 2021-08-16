/* eslint-env browser */
import {unified} from 'unified'
import remarkParse from 'remark-parse'
import remarkStringify from 'remark-stringify'
import stripMarkdown from 'strip-markdown'

const processor = unified()
  .use(remarkParse)
  .use(remarkStringify)
  .use(stripMarkdown)

const $input = document.querySelector('[autofocus]')
const $output = document.querySelector('[readonly]')

$input.addEventListener('input', oninputchange)

oninputchange()

function oninputchange() {
  $output.textContent = processor.processSync($input.value).toString()
}
