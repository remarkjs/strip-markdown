// TypeScript Version: 3.0

import {Transformer} from 'unified'

declare namespace strip {
  interface Options {
    /**
     * List of node types to leave unchanged.
     */
    keep?: Array<
      | 'heading'
      | 'text'
      | 'inlineCode'
      | 'image'
      | 'imageReference'
      | 'break'
      | 'blockquote'
      | 'list'
      | 'listItem'
      | 'strong'
      | 'emphasis'
      | 'delete'
      | 'link'
      | 'linkReference'
      | 'code'
      | 'horizontalRule'
      | 'thematicBreak'
      | 'html'
      | 'table'
      | 'tableCell'
      | 'definition'
      | 'yaml'
      | 'toml'
    >
  }
}

/**
 * Remark plugin to remove Markdown formatting.
 *
 * Removes `html`, `code`, `horizontalRule`, `table`, `yaml`, `toml` nodes and their content,
 * everything else is rendered as simple paragraphs without formatting.
 * Uses `alt` text for images.
 */
declare function strip(options?: strip.Options): Transformer

export = strip
