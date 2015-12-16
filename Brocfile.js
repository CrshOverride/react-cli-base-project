'use strict';

let babel           = require('broccoli-babel-transpiler'),
    mergeTrees      = require('broccoli-merge-trees'),
    concat          = require('broccoli-concat'),
    funnel          = require('broccoli-funnel'),
    amdNameResolver = require('amd-name-resolver'),
    omit            = require('lodash.omit'),
    babelOptions    = {
        filterExtensions: ['js', 'jsx', 'es6'],
        browserPolyfill: true,
        moduleIds: true,
        modules: 'amd',
        resolveModuleSource: amdNameResolver
    };

class ReactApp {
    constructor(options) {
        this.options = options;
    }

    index() {
        return funnel('app/static', {
            files: ['index.html'],
            annotation: 'Funnel: index.html'
        });
    }

    appJavascript() {
        let appJs = babel('app', babelOptions);

        return concat(appJs, {
            inputFiles: ['**/*.js'],
            outputFile: '/scripts/app.js'
        });

        return appJs;
    }

    vendorJavascript() {
        let loader = funnel('bower_components/loader.js', {
            files: ['loader.js']
        });

        // let react = funnel('node_modules/react', {
        //     files: ['react.js']
        // });

        // let reactDom = funnel('node_modules/react-dom', {
        //     files: ['index.js']
        // });

        // let vendorJs = babel(mergeTrees([react, reactDom]), babelOptions);
        let vendorJs = mergeTrees([loader]);

        return concat(vendorJs, {
            inputFiles: ['**/*.js'],
            outputFile: '/scripts/vendor.js',
            headerFiles: ['loader.js']
        });
    }

    allJavascript() {
        return mergeTrees([
            this.vendorJavascript(),
            this.appJavascript()
        ]);
    }

    toTree() {
        return mergeTrees([
            this.allJavascript(),
            this.index()
        ]);
    }

    _appBoot() {
        return
    }
}

let app = new ReactApp();

module.exports = app.toTree();
