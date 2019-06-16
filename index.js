'use strict'

module.exports = strip

function strip() {
  return one
}

// Expose modifiers for available node types.
// Node types not listed here are not changed (but their children are).
var map = {}

map.heading = paragraph
map.text = text
map.inlineCode = text
map.image = image
map.imageReference = image
map.break = lineBreak

map.blockquote = children
map.list = children
map.listItem = children
map.strong = children
map.emphasis = children
map.delete = children
map.link = children
map.linkReference = children

map.code = empty
map.horizontalRule = empty
map.thematicBreak = empty
map.html = empty
map.table = empty
map.tableCell = empty
map.definition = empty
map.yaml = empty
map.toml = empty

function one(node) {
  var type = node && node.type

  if (type in map) {
    node = map[type](node)
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
  return node.children
}

function lineBreak() {
  return {type: 'text', value: '\n'}
}

function empty() {
  return {type: 'text', value: ''}
}
