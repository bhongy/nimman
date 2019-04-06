/**
 * Purpose: Simply fulfill requests (sending out responses) by delegating
 *   to the underlying "services" like the compiler, router.
 *
 * Design: ?
 *
 * Network I/O aware.
 */
import * as http from 'http';
import { fromNullable } from 'fp-ts/lib/Option';
import { Compiler } from './Compiler';
import * as Router from './Router';
import { ServerInterface } from '../Server';
import { validateUrl } from '../scrapbook/Url';

// this is in DevServer to keep request -> URL concern in server
// router "takes" is network ignorant ... should it not know URL also?
// ... might be better inline?
const resolveRouteResponse = (requestUrl: undefined | string) =>
  fromNullable(requestUrl)
    .chain(validateUrl)
    .chain(Router.resolveResponse);

type HttpRequestHandler = (
  req: http.IncomingMessage,
  res: http.ServerResponse
) => void;

// TODO: this should take `router` ("move" resolveRouteResponse in here)
// figure out the contract between router <> handler
const makeRequestHandler = (compiler: Compiler): HttpRequestHandler => (
  req,
  res
) => {
  /**
   * HACK it together for now
   */
  // temporary: drop from Option (toNullable)
  // until I understand how to use `IO`
  const r = resolveRouteResponse(req.url).toNullable();
  compiler.whenReady(() => {
    if (r == null) {
      res.statusCode = 404;
      return res.end();
    }

    res.writeHead(200, r.headers);
    r.body.pipe(res);
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
