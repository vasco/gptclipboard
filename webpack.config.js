const path = require('path')
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = (env, argv) => {
  const mode = argv.mode || 'production'

  return {
    mode,
    entry: {
      contentScript: path.join(__dirname, 'src/contentScript.ts'),
    },
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: '[name].js',
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          loader: 'ts-loader',
          exclude: /node_modules/,
        },
      ],
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js'],
    },
    plugins: [
      new CopyWebpackPlugin({
        patterns: [
          { from: 'src/manifest.json', to: '[name][ext]' },
          { from: 'src/assets', to: 'assets' },
        ],
      }),
    ],
  }
}
