import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

/** @typedef {import('webpack').Configuration} WebpackConfig **/

const __dirname = dirname(fileURLToPath(import.meta.url));

/** @type {WebpackConfig} */
const extensionConfig = {
    target: 'node',
    mode: 'none',

    entry: './src/extension.ts',
    output: {
        path: resolve(__dirname, 'dist'),
        filename: 'extension.js',
        libraryTarget: 'commonjs2',
    },
    externals: {
        vscode: 'commonjs vscode',
    },
    resolve: {
        extensions: ['.ts', '.js'],
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'ts-loader',
                    },
                ],
            },
        ],
    },
    devtool: 'nosources-source-map',
    infrastructureLogging: {
        level: 'log',
    },
};

export default [extensionConfig];
