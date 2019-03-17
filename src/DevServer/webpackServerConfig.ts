import * as path from 'path';
import * as webpack from 'webpack';
import * as Project from './__Config';

const webpackServerConfig: webpack.Configuration = {
  name: 'server',
  target: 'node',
  mode: 'development',

  entry: { main: path.resolve(Project.root, 'server/render.js') },
  output: {
    path: Project.dist,
    filename: 'serverRender.js',
    libraryTarget: 'commonjs2',
  },

  optimization: {
    minimize: false,
    splitChunks: false,
  },
};

// output -> strictModuleExceptionHandling: true,

export default webpackServerConfig;
