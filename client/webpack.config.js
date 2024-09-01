const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");

module.exports = {
  resolve: {
    fallback: {
      "fs": false
    } 
  },
  plugins: [
    new NodePolyfillPlugin()
  ],
  loaders: [
    { test: /\.json$/, loader: 'json-loader' },
    // other loaders 
  ],
  module: {
    rules: [
      {
        test: /\.less$/i,
        use: [
          {
            loader: "style-loader", // creates style nodes from JS strings
          },
          {
            loader: "css-loader", // translates CSS into CommonJS
          },
          {
            loader: "less-loader", // compiles Less to CSS
          },
        ],
      },
    ],
  },
};