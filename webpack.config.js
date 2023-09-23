const path = require('path');
const CopyPlugin = require("copy-webpack-plugin");
module.exports = {
    entry: './src/index.ts',
    module: {
        rules: [{
            test: /\.tsx?$/,
            use: 'ts-loader',
            exclude: /node_modules/,
        }, ],
    },
    resolve: {
        extensions: ['.ts', '.js'],
        fallback: {
            'fs': false,
            'path': false
        }
    },
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'dist'),
    },
    plugins: [
        // new webpack.ProvidePlugin({
        //     'oimo': 'oimo',
        //     'cannon': 'cannon'
        // }),
        new CopyPlugin({
            patterns: [
                { from: "./assets", to: "assets" },
                { from: "./index.html", to: "index.html" },
            ],
        }),
    ],
    // externals: {
    //     cannon: "cannon"
    // },
    mode: 'development',
    devtool: 'source-map'
};