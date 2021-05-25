const path = require('path')
const merge = require('webpack-merge').merge
const common = require('./webpack.common')
const nodeExternals = require('webpack-node-externals')
const CopyPlugin = require("copy-webpack-plugin");

process.env.NODE_ENV = 'production'

module.exports = merge(common, {
    target: 'node',
    mode: 'production',
    devtool: 'source-map',
    entry: path.join(__dirname, '../src/lambda.tsx'),
    output: {
        path: path.join(__dirname, '../dist'),
        filename: 'index.js',
        libraryTarget: 'commonjs2'
    },
    externals: [
        nodeExternals({
            additionalModuleDirs: [
                path.resolve('../../node_modules')
            ]
        })
    ],
    resolve: {
        alias: {
            client: path.join(__dirname, '../../client')
        },
        extensions: [
            '.ts',
            '.tsx'
        ]
    },
    plugins: [
        new CopyPlugin({
            patterns: [
                {
                    from: path.join(__dirname, '../src/views'),
                    to: path.join(__dirname, '../dist/views')
                },
                {
                    from: path.join(__dirname, '../src/locales'),
                    to: path.join(__dirname, '../dist/locales')
                }
            ],
        }),
    ]
})
