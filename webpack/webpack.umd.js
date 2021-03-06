"use strict"




// ...
const
    fs = require("fs"),
    path = require("path"),
    webpack = require("webpack"),
    MinifyPlugin = require("babel-minify-webpack-plugin"),
    projectRoot = fs.realpathSync(process.cwd())




// ...
module.exports = {

    mode: "production",


    entry: {
        "cryptops": path.resolve(
            projectRoot, "src/index.js"
        ),
    },


    output: {
        filename: "[name].js",
        path: path.resolve(__dirname, "../dist"),
        library: "cryptops",
        libraryTarget: "umd",
        globalObject: "(typeof self !== 'undefined' ? self : this)",
    },


    optimization: {
        minimize: true,
        mergeDuplicateChunks: true,
        sideEffects: true,
        providedExports: true,
        concatenateModules: true,
        occurrenceOrder: true,
        removeEmptyChunks: true,
        removeAvailableModules: true,
        minimizer: [
            new MinifyPlugin({}, {
                comments: false,
            }),
        ],
    },


    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: ["babel-loader"],
                sideEffects: false,
            },
        ],
    },


    plugins: [
        new webpack.DefinePlugin({
            "process.env.BABEL_ENV": JSON.stringify("production"),
        }),
    ],


    performance: {
        hints: false,
    },

}
