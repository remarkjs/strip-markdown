/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @module strip-markdown
 * @fileoverview Remove markdown formatting.
 */

/* Expose `strip`. */
module.exports = strip;

/* Attacher. */
function strip() {
  return one;
}

/* Expose modifiers for available node types.
 * Node types not listed here are not changed
 * (but their children are). */
var map = {};

map.heading = paragraph;
map.text = map.inlineCode = text;
map.image = image;

map.blockquote = map.list = map.listItem = map.strong =
  map.emphasis = map.delete = map.link = children;

map.code = map.horizontalRule = map.thematicBreak = map.html =
  map.table = map.tableCell = empty;

/* One node. */
function one(node) {
  var type = node && node.type;

  if (type in map) {
    node = map[type](node);
  } else if (typeof type !== 'string') {
    throw new Error('Invalid type: ' + type);
  }

  if (node) {
    if (node.length) {
      node = all(node);
    }

    if (node.children) {
      node.children = all(node.children);
    }
  }

  return node;
}

/* Multiple nodes. */
function all(nodes) {
  var index = -1;
  var length = nodes.length;
  var result = [];
  var value;

  while (++index < length) {
    value = one(nodes[index]);

    if (value && typeof value.length === 'number') {
      result = result.concat(value.map(one));
    } else if (value) {
      result.push(value);
    }
  }

  return clean(result);
}

/**
 * Clean nodes: merges text's.
 *
 * @param {Array.<Node>} values
 * @return {Array.<Node>}
 */
function clean(values) {
  var index = -1;
  var length = values.length;
  var result = [];
  var prev = null;
  var value;

  while (++index < length) {
    value = values[index];

    if (prev && 'value' in value && value.type === prev.type) {
      prev.value += value.value;
    } else {
      result.push(value);
      prev = value;
    }
  }

  return result;
}

/* Return an stringified image. */
function image(token) {
  return {
    type: 'text',
    value: token.alt || token.title || ''
  };
}

/* Return `token`s value. */
function text(token) {
  return {type: 'text', value: token.value};
}

/* Return a paragraph. */
function paragraph(token) {
  return {type: 'paragraph', children: token.children};
}

/* Return the concatenation of `token`s children. */
function children(token) {
  return token.children;
}

/* Return nothing. */
function empty() {
  return {type: 'text', value: ''};
}
