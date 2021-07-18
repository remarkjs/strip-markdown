// TypeScript Version: 3.0

import {Plugin} from 'unified'

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
      | 'footnoteReference'
      | 'footnoteDefinition'
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
declare const strip: Plugin<[strip.Options?]>

export = strip
