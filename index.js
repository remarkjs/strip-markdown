'use strict';

/**
 * Throw.
 *
 * @param {string} message
 */
function error(message) {
    throw new Error(message);
}

/**
 * Return nothing.
 *
 * @return {null}
 */
function empty() {
    return null;
}

/**
 * Return an stringified image.
 *
 * @param {Image} token
 * @return {Node}
 */
function image(token) {
    return {
        'type': 'text',
        'value': token.alt || token.title || ''
    };
}

/**
 * Return the concatenation of `token`s children.
 *
 * @param {Object} token
 * @return {Array.<Node>}
 */
function children(token) {
    return token.children;
}

/**
 * Return the concatenation of `token`s children.
 *
 * @param {Object} token
 * @return {Node}
 */
function paragraph(token) {
    return {
        'type': 'paragraph',
        'children': token.children
    };
}

/**
 * Return `token`s value.
 *
 * @param {Object} token
 * @return {Node}
 */
function inline(token) {
    return {
        'type': 'text',
        'value': token.value
    };
}

/*
 * Expose modifiers for available node types.
 *
 * Node types not listed here are not
 * changed (but their children are).
 */

var map;

map = {};

map.blockquote = children;
map.list = children;
map.listItem = children;
map.strong = children;
map.emphasis = children;
map.delete = children;
map.link = children;

map.heading = paragraph;

map.text = inline;
map.inlineCode = inline;

map.code = empty;
map.html = empty;
map.horizontalRule = empty;
map.table = empty;
map.tableCell = empty;

map.image = image;

/**
 * Clean nodes: merges text's.
 *
 * @param {Array.<Node>} values
 * @return {Array.<Node>}
 */
function clean(values) {
    var index,
        length,
        result,
        value,
        prev;

    /*
     * Clean
     */

    index = -1;
    length = values.length;
    result = [];
    prev = null;

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

/*
 * Define cleaners.
 */

var strip,
    stripAll;

/**
 * Strip markdown formatting from a node.
 *
 * @param {Node} node
 * @return {null|Node|Array.<Node>}
 */
strip = function (node) {
    var type;

    type = node.type;

    if (type in map) {
        node = map[type](node);
    } else if (typeof type !== 'string') {
        error('Invalid type: ' + type);
    }

    if (node) {
        if (node.length) {
            node = stripAll(node);
        }

        if (node.children) {
            node.children = stripAll(node.children);
        }
    }

    return node;
};

/**
 * Strip markdown formatting from multiple nodes.
 *
 * @param {Array.<Node>} nodes
 * @return {Array.<Node>}
 */
stripAll = function (nodes) {
    var index,
        length,
        result,
        value;

    index = -1;
    length = nodes.length;
    result = [];

    while (++index < length) {
        value = strip(nodes[index]);

        if (value && value.length) {
            result = result.concat(value.map(strip));
        } else if (value) {
            result.push(value);
        }
    }

    return clean(result);
};

/*
 * Expose `strip`.
 */

module.exports = strip;
