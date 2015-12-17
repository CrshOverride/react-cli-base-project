'use strict';

let babel                       = require('broccoli-babel-transpiler'),
    broccoliSource              = require('broccoli-source'),
    mergeTrees                  = require('broccoli-merge-trees'),
    concat                      = require('broccoli-concat'),
    funnel                      = require('broccoli-funnel'),
    browserify                  = require('broccoli-fast-browserify'),
    omit                        = require('lodash.omit'),
    merge                       = require('lodash.merge'),
    npmJson                     = require('./package.json'),
    appDir                      = broccoliSource.WatchedDir('app'),
    babelOptions                = {
        filterExtensions: ['js', 'jsx', 'es6'],
        browserPolyfill: true
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

    appJavascript(thirdPartyDeps) {
        let appJs = babel('app', babelOptions);

        appJs = browserify(appJs, {
            browserify: {
                debug: true
            },
            bundles: {
                'scripts/app.js': {
                    entryPoints: ['index.js'],
                    externals: thirdPartyDeps
                }
            }
        });

        return appJs;
    }

    vendorJavascript(thirdPartyDeps) {
        let vendorJs = browserify('node_modules', {
            browserify: {
                debug: false
            },
            bundles: {
                'scripts/vendor.js': {
                    entryPoints: [],
                    require: thirdPartyDeps
                }
            }
        });

        return vendorJs;
    }

    allJavascript() {
        let thirdPartyKeys = Object.keys(npmJson.dependencies || {})

        return mergeTrees([this.vendorJavascript(thirdPartyKeys), this.appJavascript(thirdPartyKeys)]);
    }

    toTree() {
        return mergeTrees([
            this.allJavascript(),
            this.index()
        ]);
    }
}

let app = new ReactApp();

module.exports = app.toTree();
