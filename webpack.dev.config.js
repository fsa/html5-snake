"use strict";
const webpack = require("webpack");
const { merge } = require("webpack-merge");
const baseWebpackConfig = require("./webpack.config");
const devWebpackConfig = merge(baseWebpackConfig, {
    mode: "development",
    devServer: {
        port: 3000
    },
    plugins: [
        new webpack.SourceMapDevToolPlugin(),
    ],
});

module.exports = new Promise((resolve, reject) => {
    resolve(devWebpackConfig);
});