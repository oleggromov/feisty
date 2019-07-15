const MiniCssExtractPlugin = require('mini-css-extract-plugin')

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
  prerender: ({ entry, outDir, outFile, mode, publicPath }) => {
    return {
      entry,
      mode,
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
            test: /\.(png|jpe?g|gif)$/,
            use: [
              {
                loader: 'file-loader',
                options: {
                  emitFile: false,
                  name: '[name].[hash:6].[ext]'
                }
              },
            ],
          }
        ]
      }
    }
  },

  client: ({ entry, outDir, mode, publicPath }) => {
    return {
      entry,
      mode,
      output: {
        filename: '[name].[hash:6].js',
        path: outDir,
        publicPath
      },
      optimization: {
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
          filename: '[name].[hash:6].css'
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
                    require('postcss-preset-env')()
                  ]
                }
              },
            ]
          },
          {
            test: /\.(png|jpe?g|gif)$/,
            use: [
              {
                loader: 'file-loader',
                options: {
                  name: '[name].[hash:6].[ext]'
                }
              },
            ],
          }
        ]
      }
    }
  }
}
