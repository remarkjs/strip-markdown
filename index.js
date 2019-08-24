'use strict'

module.exports = strip

// Expose modifiers for available node types.
// Node types not listed here are not changed (but their children are).
var map = {
  heading: paragraph,
  text: text,
  inlineCode: text,
  image: image,
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
  toml: empty
}
var mapFiltered

function strip(options) {
  var keep = (options || {}).keep || []

  // Remove node types specified in `keep` from map
  mapFiltered = Object.assign({}, map)
  keep.forEach(function(nodeType) {
    if (nodeType in mapFiltered) {
      delete mapFiltered[nodeType]
    } else {
      throw new Error(
        'Invalid `keep` option: No modifier is defined for node type `' +
          nodeType +
          '`'
      )
    }
  })

  return one
}

function one(node) {
  var type = node && node.type

  if (type in mapFiltered) {
    node = mapFiltered[type](node)
  }

  if ('length' in node) {
    node = all(node)
  }

  if (node.children) {
    node.children = all(node.children)
  }

  return node
}

function all(nodes) {
  var index = -1
  var length = nodes.length
  var result = []
  var value

  while (++index < length) {
    value = one(nodes[index])

    if (value && typeof value.length === 'number') {
      result = result.concat(value.map(one))
    } else {
      result.push(value)
    }
  }

  return clean(result)
}

// Clean nodes: merges texts.
function clean(values) {
  var index = -1
  var length = values.length
  var result = []
  var prev = null
  var value

  while (++index < length) {
    value = values[index]

    if (prev && 'value' in value && value.type === prev.type) {
      prev.value += value.value
    } else {
      result.push(value)
      prev = value
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
