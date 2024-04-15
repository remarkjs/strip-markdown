/**
 * @typedef {import('mdast').Heading} Heading
 * @typedef {import('mdast').Image} Image
 * @typedef {import('mdast').ImageReference} ImageReference
 * @typedef {import('mdast').InlineCode} InlineCode
 * @typedef {import('mdast').Nodes} Nodes
 * @typedef {import('mdast').Paragraph} Paragraph
 * @typedef {import('mdast').Parents} Parents
 * @typedef {import('mdast').Root} Root
 * @typedef {import('mdast').RootContent} RootContent
 * @typedef {import('mdast').Text} Text
 */

/**
 * @callback Handler
 *   Transform a node.
 * @param {any} node
 *   Node.
 * @returns {Array<Nodes> | Nodes | null | undefined}
 *   Result.
 *
 * @typedef {Partial<Record<Nodes['type'], Handler | undefined>>} Handlers
 *   Handlers.
 *
 * @typedef Options
 *   Configuration.
 * @property {ReadonlyArray<Nodes['type']> | null | undefined} [keep]
 *   List of node types to leave unchanged (optional).
 * @property {ReadonlyArray<readonly [Nodes['type'], Handler] | Nodes['type']> | null | undefined} [remove]
 *   List of node types to remove (or replace, with handlers) (optional).
 */

/**
 * Expose modifiers for available node types.
 * Node types not listed here are not changed (but their children are).
 *
 * @type {Handlers}
 */
const defaults = {
  blockquote: children,
  break: lineBreak,
  code: empty,
  definition: empty,
  delete: children,
  emphasis: children,
  footnoteReference: empty,
  footnoteDefinition: empty,
  heading: paragraph,
  html: empty,
  image,
  imageReference: image,
  inlineCode: text,
  list: children,
  listItem: children,
  link: children,
  linkReference: children,
  strong: children,
  table: empty,
  tableCell: empty,
  text,
  thematicBreak: empty,
  // @ts-expect-error: custom frontmatter, sometimes defined with
  // `remark-frontmatter`.
  toml: empty,
  yaml: empty
}

/** @type {Readonly<Options>} */
const emptyOptions = {}
/** @type {ReadonlyArray<Nodes['type']>} */
const emptyTypes = []

/**
 * Remove markdown formatting.
 *
 * * remove `code`, `html`, `horizontalRule`, `table`, `toml`, `yaml`, and
 *   their content
 * * render everything else as simple paragraphs without formatting
 * * uses `alt` text for images
 *
 * @param {Readonly<Options> | null | undefined} [options]
 *   Configuration (optional).
 * @returns
 *   Transform.
 */
export default function stripMarkdown(options) {
  const handlers = {...defaults}
  const settings = options || emptyOptions
  const keep = settings.keep || emptyTypes
  const remove = settings.remove || emptyTypes

  let index = -1

  while (++index < remove.length) {
    const value = remove[index]

    if (typeof value === 'string') {
      handlers[value] = empty
    } else {
      handlers[value[0]] = value[1]
    }
  }

  /** @type {Handlers} */
  let map = {}

  if (keep.length === 0) {
    map = handlers
  } else {
    /** @type {Nodes['type']} */
    let key

    for (key in handlers) {
      if (!keep.includes(key)) {
        map[key] = handlers[key]
      }
    }

    index = -1

    // Warn if unknown keys are turned off.
    while (++index < keep.length) {
      key = keep[index]

      if (!Object.hasOwn(handlers, key)) {
        throw new Error(
          'Unknown node type `' +
            key +
            "` in `keep`, use a replace tuple with a handle instead: `remove: [['" +
            key +
            "', handle]]`"
        )
      }
    }
  }

  /**
   * @param {Root} tree
   *   Current tree.
   * @returns {Root}
   *   New tree.
   */
  return function (tree) {
    // Cast as we assume root in -> root out.
    const result = /** @type {Root} */ (one(tree))
    return result
  }

  /**
   * @param {Nodes} node
   *   Node.
   * @returns {Array<Nodes> | Nodes | undefined}
   *   Result.
   */
  function one(node) {
    /** @type {Nodes['type']} */
    const type = node.type
    /** @type {Array<Nodes> | Nodes | undefined} */
    let result = node

    if (Object.hasOwn(map, type)) {
      const handler = map[type]
      if (handler) result = handler(result) || undefined
    }

    result = Array.isArray(result) ? all(result) : result

    if (result && 'children' in result) {
      // @ts-expect-error: assume content models match.
      result.children = all(result.children)
    }

    return result
  }

  /**
   * @param {Array<Nodes>} nodes
   *   Nodes.
   * @returns {Array<Nodes>}
   *   Result.
   */
  function all(nodes) {
    let index = -1
    /** @type {Array<Nodes>} */
    const result = []

    while (++index < nodes.length) {
      const value = one(nodes[index])

      if (Array.isArray(value)) {
        result.push(...all(value))
      } else if (value) {
        result.push(value)
      }
    }

    return clean(result)
  }
}

/**
 * Clean nodes: merges literals.
 *
 * @param {Array<Nodes>} values
 *   Nodes.
 * @returns {Array<Nodes>}
 *   Results.
 */
function clean(values) {
  let index = -1
  /** @type {Array<Nodes>} */
  const result = []
  /** @type {Nodes | undefined} */
  let previous

  while (++index < values.length) {
    const value = values[index]

    if (
      previous &&
      value.type === previous.type &&
      'value' in value &&
      'value' in previous
    ) {
      previous.value += value.value
    } else {
      result.push(value)
      previous = value
    }
  }

  return result
}

/**
 * @param {Image | ImageReference} node
 *   Node.
 * @returns {Text | undefined}
 *   Result.
 * @satisfies {Handler}
 */
function image(node) {
  const title = 'title' in node ? node.title : ''
  const value = node.alt || title || ''
  return value ? {type: 'text', value} : undefined
}

/**
 * @param {InlineCode | Text} node
 *   Node.
 * @returns {Text}
 *   Result.
 * @satisfies {Handler}
 */
function text(node) {
  return {type: 'text', value: node.value}
}

/**
 * @param {Heading | Paragraph} node
 *   Node.
 * @returns {Paragraph}
 *   Result.
 * @satisfies {Handler}
 */
function paragraph(node) {
  return {type: 'paragraph', children: node.children}
}

/**
 * @param {Parents} node
 *   Parent.
 * @returns {Array<RootContent>}
 *   Node.
 * @satisfies {Handler}
 */
function children(node) {
  return node.children
}

/**
 * @returns {Text}
 *   Node.
 * @satisfies {Handler}
 */
function lineBreak() {
  return {type: 'text', value: '\n'}
}

/**
 * @returns {undefined}
 *   Nothing.
 * @satisfies {Handler}
 */
function empty() {
  return undefined
}
