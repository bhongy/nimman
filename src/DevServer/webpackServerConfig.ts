import * as path from 'path';
import * as webpack from 'webpack';

const webpackServerConfig: webpack.Configuration = {
  name: 'server',
  target: 'node',
  mode: 'development',

  entry: { main: path.resolve(__dirname, '../../example/server/render.js') },
  output: {
    path: path.resolve(__dirname, '../../example/dist'),
    filename: 'render.js',
    libraryTarget: 'commonjs2',
  },

  optimization: {
    minimize: false,
    splitChunks: false,
  },
};

// output -> strictModuleExceptionHandling: true,

export default webpackServerConfig;
