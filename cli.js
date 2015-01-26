#!/usr/bin/env node
'use strict';

/*
 * Dependencies.
 */

var path,
    spawn,
    pack;

path = require('path');
spawn = require('win-fork');
pack = require('./package.json');

/*
 * Resolve.
 */

var mdast,
    strip;

mdast = require.resolve('mdast/cli.js');
strip = require.resolve('./index.js');

/*
 * Arguments.
 */

var argv;

argv = process.argv.slice(2);

/*
 * Command.
 */

var command;

command = Object.keys(pack.bin)[0];
if (argv[0] === '--version' || argv[0] === '-v') {
    /*
     * Version.
     */

    console.log(pack.version);
} else if (argv[0] === '--help' || argv[0] === '-h') {
    /*
     * Help.
     */

    console.log([
        '',
        'Usage: ' + command + ' [options] [mdast options]',
        '',
        pack.description,
        '',
        'Options:',
        '',
        '  -h, --help            output usage information',
        '  -v, --version         output version number',
        '',
        'Help for mdast:',
        '',
        '  https://github.com/wooorm/mdast',
        '',
        'Usage:',
        '',
        '# Pass `Readme.md` through ' + command,
        '$ ' + command + ' Readme.md > Readme.txt',
        '',
        '# Pass stdin through ' + command + ', with mdast options',
        '$ echo "*Emphasis* and **strongness**" | ' + command +
            ' --ast > ast.json',
        '',
        '# Use other plugins',
        '$ npm install some-plugin',
        '$ cat History.md | ' + command + ' --use some-plugin > History.txt'
    ].join('\n  ') + '\n');
} else {
    /*
     * Spawn.
     */

    var proc;

    proc = spawn(mdast, ['--use', strip].concat(argv), {
        'stdio': 'inherit'
    });

    /*
     * Exit.
     */

    proc.on('exit', function (code) {
        process.exit(code);
    });
}
