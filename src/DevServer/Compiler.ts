/**
 * An abstract Compiler that can notify "compiling" and "ready".
 *
 * Purpose: limit interface & interaction with the webpack compiler.
 *
 * Design:
 *
 */
import * as webpack from 'webpack';
import clientConfig from './webpackClientConfig';
import serverConfig from './webpackServerConfig';

/**
 * A stateful object that will queue the callbacks during "not ready" state
 * and will "drain" (calls) all the callbacks synchronously when ready.
 * A callback being added during ready state will be executed right away.
 * ---
 * Thought: all we want to know is that all related bundles (client & server)
 * to serve a specific route are built. We might be able to refactor it to
 * notify per route.
 */
class WaitUntilReady {
  private callbacks: Array<() => void> = [];
  private isReady: boolean = false;

  ready(): void {
    this.isReady = true;
    this.callbacks.forEach(cb => cb());
    this.callbacks = [];
  }

  notReady(): void {
    this.isReady = false;
  }

  whenReady(cb: () => void): void {
    this.isReady ? cb() : this.callbacks.push(cb);
  }
}

export class Compiler {
  private readonly multicompiler: webpack.MultiCompiler;
  private readonly waitUntilReady: WaitUntilReady;

  constructor() {
    // How to I lift this state and mangage it in a less adhoc manner
    // thinking of it as an event-driven state machine, an Actor?
    this.waitUntilReady = new WaitUntilReady();
    this.multicompiler = webpack([clientConfig, serverConfig]);

    /**
     * HACK it together for now
     *
     * Eventually, I want to model these to entities
     * with well-defined/modeled communications
     **/

    // TODO: make sure we cover all "watch" hooks
    // @ts-ignore: not sure why "hooks does not exist MultiCompiler"
    this.multicompiler.hooks.invalid.tap('Nimman.Compiler', () => {
      this.waitUntilReady.notReady();
      console.log('rebuilding ...');
    });

    // @ts-ignore: not sure why "hooks does not exist MultiCompiler"
    this.multicompiler.hooks.done.tap('Nimman.Compiler', stats => {
      this.waitUntilReady.ready();
      const { startTime, endTime } = stats.stats[0];
      console.log(`compilation is done (${endTime - startTime}ms)`);
    });

    this.multicompiler.watch({}, () => {});
  }

  whenReady(fn: () => unknown): void {
    this.waitUntilReady.whenReady(fn);
  }
}
