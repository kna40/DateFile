const path = require("path");

module.exports = {
  //target: "electron-main",
  entry: "./src/index.js", // Entry point of your application
  output: {
    path: path.resolve(__dirname, "renderer"),
    filename: "index.js",
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env", "@babel/preset-react"],
          },
        },
      },
    ],
  },
};
