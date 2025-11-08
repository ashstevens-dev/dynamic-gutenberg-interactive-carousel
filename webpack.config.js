const defaultConfig = require('@wordpress/scripts/config/webpack.config');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  ...defaultConfig,
  plugins: [
    ...defaultConfig.plugins,
    new CopyWebpackPlugin({
      patterns: [
        { from: 'src/*/assets/', to: 'interactive-carousel/assets/[name][ext]' },
      ],
    }),
  ],
};
