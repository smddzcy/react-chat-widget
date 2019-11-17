// const webpack = require('webpack');
const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
// const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');

module.exports = [
  {
    entry: './index.js',
    output: {
      path: path.join(__dirname, '/lib'),
      filename: 'index.js',
      library: 'react-chat-widget',
      libraryTarget: 'umd',
      chunkFilename: 'chunk.[chunkhash:8].js',
      publicPath: 'https://cdn.infoset.app/chat/', // NOTE: change accordingly for chunk prefetching to work
    },
    resolve: {
      extensions: ['.js'],
    },
    mode: 'production',
    externals: {
      react: {
        commonjs: 'react',
        commonjs2: 'react',
        amd: 'react',
        umd: 'react',
        root: 'React'
      },
      'react-dom': {
        commonjs: 'react-dom',
        commonjs2: 'react-dom',
        amd: 'react-dom',
        umd: 'react-dom',
        root: 'ReactDOM'
      },
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          loader: 'babel-loader',
        },
        {
          test: /\.scss$/,
          use: [
            MiniCssExtractPlugin.loader,
            'css-loader',
            {
              loader: 'postcss-loader',
              options: {
                ident: 'postcss',
                plugins: () => [
                  require('postcss-flexbugs-fixes'), // eslint-disable-line
                  autoprefixer(),
                  cssnano(),
                ],
              },
            },
            {
              loader: 'sass-loader',
              options: {
                sassOptions: {
                  includePaths: [path.resolve(__dirname, 'src/scss/')],
                },
              },
            },
          ],
        },
        {
          test: /\.svg$/,
          use: ['svgr-loader', 'url-loader'],
        },
        {
          test: /\.(jpg|png|gif)$/,
          use: {
            loader: 'url-loader',
          },
        },
      ],
    },
    plugins: [
      // new BundleAnalyzerPlugin(),
      new CleanWebpackPlugin({ cleanOnceBeforeBuildPatterns: ['lib/*'] }),
      /**
       * Known issue for the CSS Extract Plugin in Ubuntu 16.04: You'll need to install
       * the following package: sudo apt-get install libpng16-dev
       */
      new MiniCssExtractPlugin({
        filename: 'styles.css',
        chunkFileName: '[id].css',
      }),
    ],
    optimization: {
      minimizer: [
        new TerserPlugin({
          cache: true,
          parallel: true,
          terserOptions: {
            ecma: 6,
          },
        }),
        new OptimizeCSSAssetsPlugin({
          cssProcessorOptions: {
            discardComments: { removeAll: true },
            reduceIdents: false,
          },
        }),
      ],
    },
  },
  {
    entry: './src/components/Widget/style.scss',
    output: {
      path: path.join(__dirname, '/lib'),
    },
    mode: 'production',
    module: {
      rules: [
        {
          test: /\.scss$/,
          use: [
            MiniCssExtractPlugin.loader,
            'css-loader',
            {
              loader: 'postcss-loader',
              options: {
                ident: 'postcss',
                plugins: () => [
                  require('postcss-flexbugs-fixes'), // eslint-disable-line
                  autoprefixer(),
                  cssnano(),
                ],
              },
            },
            {
              loader: 'sass-loader',
              options: {
                sassOptions: {
                  includePaths: [path.resolve(__dirname, 'src/scss/')],
                },
              },
            },
          ],
        },
      ],
    },
    plugins: [
      /**
       * Known issue for the CSS Extract Plugin in Ubuntu 16.04: You'll need to install
       * the following package: sudo apt-get install libpng16-dev
       */
      new MiniCssExtractPlugin({
        filename: 'outerStyles.css',
        chunkFileName: '[id].css',
      }),
    ],
    optimization: {
      minimizer: [
        new OptimizeCSSAssetsPlugin({
          cssProcessorOptions: {
            discardComments: { removeAll: true },
            reduceIdents: false,
          },
        }),
      ],
    },
  },
];
