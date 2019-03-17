import * as path from 'path';
import * as webpack from 'webpack';
import * as Project from './__Config';

const webpackClientConfig: webpack.Configuration = {
  name: 'client',
  target: 'web',
  mode: 'development',

  // TEMPORARY until we handle on-demand (dynamic) entries
  entry: {
    inbox: path.resolve(Project.src, 'inbox.js'),
    message: path.resolve(Project.src, 'message.js'),
    '404': path.resolve(Project.src, '404.js'),
  },
  output: {
    path: Project.dist,
    filename: '[name].js',
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
