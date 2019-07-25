const TerserJSPlugin = require('terser-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')

const jsLoader = {
  test: /\.js$/,
  exclude: /node_modules/,
  use: {
    loader: 'babel-loader',
    options: {
      presets: ['@babel/preset-env', '@babel/preset-react']
    }
  }
}

module.exports = {
  prerender: ({ entry, outDir, outFile, publicPath }) => {
    return {
      entry,
      mode: 'development',
      target: 'node',
      output: {
        filename: outFile,
        path: outDir,
        publicPath,
        libraryExport: 'default',
        libraryTarget: 'commonjs2'
      },
      module: {
        rules: [
          jsLoader,
          {
            test: /\.css$/,
            use: ['css-loader']
          },
          {
            test: /\.(png|jpe?g|gif|svg)$/,
            use: [
              {
                loader: 'file-loader',
                options: {
                  emitFile: false,
                  name: '[name].[contenthash:6].[ext]'
                }
              },
            ],
          }
        ]
      }
    }
  },

  client: ({ entry, outDir, publicPath }) => {
    return {
      entry,
      mode: 'production',
      output: {
        filename: '[name].[contenthash:6].js',
        path: outDir,
        publicPath,
        chunkFilename: '[name].[contenthash:6].js'
      },
      optimization: {
        minimizer: [new TerserJSPlugin(), new OptimizeCSSAssetsPlugin()],
        splitChunks: {
          chunks: 'initial',
          minChunks: 1,
          name: true,
          cacheGroups: {
            vendors: {
              test: /\/node_modules\//,
              name: 'vendor'
            },
            default: false
          }
        }
      },
      plugins: [
        new MiniCssExtractPlugin({
          filename: '[name].[contenthash:6].css'
        }),
      ],
      module: {
        rules: [
          jsLoader,
          {
            test: /\.css$/,
            use: [
              MiniCssExtractPlugin.loader,
              'css-loader',
              {
                loader: 'postcss-loader',
                options: {
                  plugins: [
                    require('postcss-import')(),
                    require('postcss-assets')(),
                    require('postcss-preset-env')()
                  ]
                }
              },
            ]
          },
          {
            test: /\.(png|jpe?g|gif|svg)$/,
            use: [
              {
                loader: 'file-loader',
                options: {
                  name: '[name].[contenthash:6].[ext]'
                }
              },
            ],
          }
        ]
      }
    }
  }
}
