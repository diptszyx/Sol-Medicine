const webpack = require("webpack");
const path = require("path");

module.exports = function override(config) {
  const fallback = config.resolve.fallback || {};
  Object.assign(fallback, {
    crypto: require.resolve("crypto-browserify"),
    stream: require.resolve("stream-browserify"),
    assert: require.resolve("assert"),
    http: require.resolve("stream-http"),
    https: require.resolve("https-browserify"),
    os: require.resolve("os-browserify"),
    url: require.resolve("url"),
    zlib: require.resolve("browserify-zlib"),
    borsh: require.resolve("@coral-xyz/borsh"), // Add zlib polyfill here
  });
  config.resolve.fallback = fallback;

  config.plugins = (config.plugins || []).concat([
    new webpack.ProvidePlugin({
      process: "process/browser",
      Buffer: ["buffer", "Buffer"],
    }),
  ]);

  // Allow imports from outside src/
  config.resolve.plugins = config.resolve.plugins.filter(
    (plugin) => plugin.constructor.name !== "ModuleScopePlugin"
  );

  // Add alias for Solana packages
  config.resolve.alias = {
    ...config.resolve.alias,
    "@solana/spl-token": path.resolve(
      __dirname,
      "node_modules/@solana/spl-token"
    ),
    "@solana/spl-token-metadata": path.resolve(
      __dirname,
      "node_modules/@solana/spl-token-metadata"
    ),
    "@solana/web3.js": path.resolve(__dirname, "node_modules/@solana/web3.js"),
    "@metaplex-foundation/js": path.resolve(
      __dirname,
      "node_modules/@metaplex-foundation/js"
    ),
  };

  // Add configuration to handle ES modules
  config.module.rules.push({
    test: /\.mjs$/,
    include: /node_modules/,
    type: "javascript/auto",
  });

  return config;
};
