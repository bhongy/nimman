import * as webpack from 'webpack';
import clientConfig from './webpackClientConfig';
import serverConfig from './webpackServerConfig';

// abstract to Compiler that can notify "compiling" and "ready"
export class Compiler {
  private readonly multicompiler: any;
  private watching: any;
  // private readonly multicompiler: webpack.MultiCompiler;
  private ready: Promise<void>;

  constructor() {
    this.multicompiler = webpack([clientConfig, serverConfig]);
    this.ready = new Promise(resolve => {
      this.watching = this.multicompiler.watch(null, () => {
        resolve();
        console.log('compilation is done');
      });
    });
  }

  whenReady(fn: () => unknown): void {
    this.ready.then(fn);
  }
}
