const webpack = require('webpack');
const path = require('path');

const common = {
    entry: {
        zigne: './src/index.js',
    },

    mode: 'production',

    module: {
        rules: [
            {
                test: /\.js$/,
                include: [path.join(__dirname, 'src')],
                loader: 'babel-loader',
            },
        ],
    },

    optimization: {
        minimize: true,
    },
};

module.exports = [
    {
        target: 'web',

        output: {
            path: path.join(__dirname, 'dist'),
            filename: 'zigne.browser.js',
            libraryTarget: 'umd',
            libraryExport: 'default',
            library: 'zigne',
        },

        ...common,
    },

    {
        target: 'node',

        output: {
            path: path.join(__dirname, 'dist'),
            filename: 'zigne.node.js',
            libraryTarget: 'umd',
            libraryExport: 'default',
            library: 'zigne',
        },

        ...common,
    },
];
