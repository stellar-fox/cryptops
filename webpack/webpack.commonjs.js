"use strict"




// ...
const
    fs = require("fs"),
    path = require("path"),
    webpack = require("webpack"),
    projectRoot = fs.realpathSync(process.cwd()),
    nodeExternals = require("webpack-node-externals")




// ...
module.exports = {

    mode: "production",


    target: "node",


    entry: {
        "cryptops": path.resolve(
            projectRoot, "src/index.js"
        ),
    },


    output: {
        filename: "[name].js",
        path: path.resolve(__dirname, "../lib"),
        libraryTarget: "commonjs",
        globalObject: "global",
    },


    externals: [nodeExternals()],


    optimization: {
        minimize: false,
        mergeDuplicateChunks: true,
        sideEffects: true,
        providedExports: true,
        concatenateModules: true,
        occurrenceOrder: true,
        removeEmptyChunks: true,
        removeAvailableModules: true,
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

}
