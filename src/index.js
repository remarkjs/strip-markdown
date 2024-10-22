/* eslint-env browser */
import remarkParse from 'remark-parse'
import remarkStringify from 'remark-stringify'
import stripMarkdown from 'strip-markdown'
import {unified} from 'unified'

const processor = unified()
  .use(remarkParse)
  .use(remarkStringify)
  .use(stripMarkdown)

const $input = /** @type {HTMLTextAreaElement} */ (
  document.querySelector('[autofocus]')
)
const $output = /** @type {HTMLTextAreaElement} */ (
  document.querySelector('[readonly]')
)

$input.addEventListener('input', oninputchange)

oninputchange()

function oninputchange() {
  $output.textContent = String(processor.processSync($input.value))
}
