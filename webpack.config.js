"use strict";

const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    entry: "./src/index.js",
    output: {
        publicPath: "/html5-snake",
    },
    module: {
        rules: [
            {
                test: /\.(js)$/,
                use: "babel-loader",
            },
            {
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    "css-loader",
                    "postcss-loader",
                ],
            },
            {
                test: /\.(png|jpe?g|gif|ico)$/i,
                loader: "file-loader",
                options: {
                    outputPath: "img",
                    name: "[name].[ext]",
                },
            },
        ],
    },
    plugins: [
        new MiniCssExtractPlugin(),
        new HtmlWebpackPlugin({
            template: "src/index.html",
        }),
    ],
};
