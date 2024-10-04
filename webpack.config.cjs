const path = require('path');

module.exports = {
  entry: './src/trafficFeature.js',
  output: {
    filename: 'trafficFeature.bundle.js',
    path: path.resolve(__dirname, 'public'),
  },
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  }
};
