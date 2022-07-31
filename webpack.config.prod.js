const {smart} = require('webpack-merge');
const base = require('./webpack.config.base');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const OptimizeCssPlugin = require('optimize-css-assets-webpack-plugin');

const webpack = require('webpack');
const path = require('path');

module.exports = smart(base, {
    mode: 'production',
    devtool: 'source-map',
    plugins: [
        new webpack.DllReferencePlugin({
            manifest: path.resolve(__dirname, 'dist', 'dll', 'manifest.json')
        }),
        new CleanWebpackPlugin({
            cleanOnceBeforeBuildPatterns: ['**/*', '!dll', '!dll/**'] //不删除dll目录
        }),
        new OptimizeCssPlugin(),
    ]
});