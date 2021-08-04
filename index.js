// Expose modifiers for available node types.
// Node types not listed here are not changed (but their children are).
const defaults = {
  heading: paragraph,
  text,
  inlineCode: text,
  image,
  imageReference: image,
  break: lineBreak,

  blockquote: children,
  list: children,
  listItem: children,
  strong: children,
  emphasis: children,
  delete: children,
  link: children,
  linkReference: children,

  code: empty,
  horizontalRule: empty,
  thematicBreak: empty,
  html: empty,
  table: empty,
  tableCell: empty,
  definition: empty,
  yaml: empty,
  toml: empty,

  footnoteReference: empty,
  footnoteDefinition: empty
}

const own = {}.hasOwnProperty

export default function stripMarkdown(options = {}) {
  const handlers = Object.assign({}, defaults)
  const remove = options.remove || []
  const keep = options.keep || []

  let index = -1

  while (++index < remove.length) {
    const value = remove[index]

    if (Array.isArray(value)) {
      handlers[value[0]] = value[1]
    } else {
      handlers[value] = empty
    }
  }

  let map = {}

  if (keep.length === 0) {
    map = handlers
  } else {
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

      if (!own.call(handlers, key)) {
        throw new Error(
          'Invalid `keep` option: No modifier is defined for node type `' +
            key +
            '`'
        )
      }
    }
  }

  return one

  function one(node) {
    const type = node.type

    if (type in map) {
      const result = map[type](node)
      node = Array.isArray(result) ? all(result) : result
    }

    if (node.children) {
      node.children = all(node.children)
    }

    return node
  }

  function all(nodes) {
    const result = []
    let index = -1

    while (++index < nodes.length) {
      const value = one(nodes[index])

      if (Array.isArray(value)) {
        result.push(...value.map((d) => one(d)))
      } else {
        result.push(value)
      }
    }

    return clean(result)
  }
}

// Clean nodes: merges texts.
function clean(values) {
  const result = []
  let index = -1
  let previous

  while (++index < values.length) {
    const value = values[index]

    if (previous && value.type === previous.type && 'value' in value) {
      previous.value += value.value
    } else {
      result.push(value)
      previous = value
    }
  }

  return result
}

function image(node) {
  return {type: 'text', value: node.alt || node.title || ''}
}

function text(node) {
  return {type: 'text', value: node.value}
}

function paragraph(node) {
  return {type: 'paragraph', children: node.children}
}

function children(node) {
  return node.children || []
}

function lineBreak() {
  return {type: 'text', value: '\n'}
}

function empty() {
  return {type: 'text', value: ''}
}
