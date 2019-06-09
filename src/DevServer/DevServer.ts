/**
 * Purpose: Simply fulfill requests (sending out responses) by delegating
 *   to the underlying "services" like the compiler, router.
 *
 * Design: ?
 *
 * Network I/O aware.
 */
import * as http from 'http';
import { Compiler } from './Compiler';
import * as Router from './Router';
import { ServerInterface } from '../Server';

interface HttpRequestHandler {
  (req: http.IncomingMessage, res: http.ServerResponse): void;
}

const makeRequestHandler = (compiler: Compiler): HttpRequestHandler => (
  req,
  res
) => {
  /**
   * HACK together for now
   */
  const url = new URL(req.url || '', 'http://localhost:3000');
  const responseResolved = Router.resolveResponse(url).run();
  compiler.whenReady(() => {
    responseResolved.then(({ statusCode, headers, body }) => {
      // TODO: better way to validate, construct headers
      // if Content-Type is wrong (e.g. plain/text instead of text/plain)
      // it fails silently in browser and hard to debug
      res.writeHead(statusCode, headers);
      body.pipe(res);
    });
  });
};

class DevServer implements ServerInterface {
  private readonly httpServer: http.Server;

  constructor(requestHandler: HttpRequestHandler) {
    this.httpServer = http.createServer(requestHandler);
  }

  // `start` is called by "user" we cannot statically guarantee the type
  start(port: unknown): Promise<void> {
    return new Promise((resolve, reject) => {
      this.httpServer.once('error', reject);
      this.httpServer.once('listening', () => resolve());
      this.httpServer.listen(port);
    });
  }

  close(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.httpServer.close(err => {
        err ? reject(err) : resolve();
      });
    });
  }

  // is this the "server" entity's responsibility?
  get buildId() {
    // compilation.hash ?
    return 'development';
  }
}

export function createDevServer() {
  const compiler = new Compiler();
  const requestHandler = makeRequestHandler(compiler);
  return new DevServer(requestHandler);
}
