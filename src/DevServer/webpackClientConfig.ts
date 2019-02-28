import * as path from 'path';
import * as webpack from 'webpack';

const webpackClientConfig: webpack.Configuration = {
  name: 'client',
  target: 'web',
  mode: 'development',

  entry: { main: path.resolve(__dirname, '../../example/app/main.js') },
  output: {
    path: path.resolve(__dirname, '../../example/dist'),
    filename: 'main.js',
  },

  // optimization: {
  //   // split client chunks in dev too
  //   // keep the behavior in dev and prod as close as possible
  //   runtimeChunk: 'multiple',
  //   splitChunks: {
  //     chunks: 'all',
  //     cacheGroups: {},
  //   },
  // },
};

export default webpackClientConfig;
