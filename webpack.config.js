const webpack = require('webpack');
const path = require('path');
const fs = require('fs');
const ESLintPlugin = require('eslint-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const { CleanWebpackPlugin } = require("clean-webpack-plugin");


const pkJson = require('./package.json');
const license = fs.readFileSync('./LICENSE', 'utf-8');

const copyright = (licenseFile) => `
  ${pkJson.displayName} v${pkJson.version}
  ----------------------------------------
  Copyright (c) ${new Date().getFullYear()} ${pkJson.author}.
  Homepage: ${pkJson.homepage}
  Released under the ${pkJson.license} License.

  License information can be found in ${licenseFile}.
`;


module.exports = {
  entry: './src/main.ts',
  devtool: 'inline-source-map',
  output: {
    path: path.resolve(__dirname, './dist'),
    publicPath: '/dist/',
    filename: 'index.js',

    library: {
      name: pkJson.name,
      type: 'umd',
      umdNamedDefine: true,
    },
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      { test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader' },
      {
        test: /\.scss$/,
        use: [
          'css-loader',
          'sass-loader',
        ],
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
    alias: {
      '@': path.resolve(__dirname, './src/'),
    },
  },
  plugins: [
    new webpack.BannerPlugin(license),
    new ESLintPlugin({
      cache: true,
      eslintPath: require.resolve('eslint'),
      resolvePluginsRelativeTo: __dirname,
      ignore: true,
      useEslintrc: true,
      extensions: ['ts', 'js'],
    }),
    new CleanWebpackPlugin({
      cleanStaleWebpackAssets: false,
      cleanOnceBeforeBuildPatterns: [path.resolve(__dirname, './dist')],
    }),
  ],
  optimization: {
    minimize: process.env.NODE_ENV === 'production',
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          sourceMap: true,
        },
        extractComments: {
          filename: `${pkJson.name}.LICENSE.txt`,
          banner: copyright,
        },
      }),
    ],
  },
};
