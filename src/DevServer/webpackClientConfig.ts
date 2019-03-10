import * as webpack from 'webpack';
import * as Project from './__Config';

const webpackClientConfig: webpack.Configuration = {
  name: 'client',
  target: 'web',
  mode: 'development',

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
