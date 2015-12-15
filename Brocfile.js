'use strict';

let babel           = require('broccoli-babel-transpiler'),
    babelPath       = require.resolve('babel-core'),
    mergeTrees      = require('broccoli-merge-trees'),
    concat          = require('broccoli-concat'),
    funnel          = require('broccoli-funnel'),
    amdNameResolver = require('amd-name-resolver'),
    appJs           = babel('app', {
        filterExtensions: ['js', 'jsx', 'es6'],
        browserPolyfill: true,
        moduleIds: true,
        modules: 'amdStrict',
        resolveModuleSource: amdNameResolver
    });

// Concat the tree to a single file
appJs = concat(appJs, {
    inputFiles: ['**/*.js'],
    outputFile: '/js/app.js'
});

// Grab index.html
let index = funnel('app/static', { files: ['index.html'] });



module.exports = mergeTrees([index, appJs]);
