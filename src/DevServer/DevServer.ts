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
import { getRoute } from './Router';
import { ServerInterface } from '../Server';

const resolveRouteResponse = (requestUrl: undefined | string) =>
  fromNullable(requestUrl)
    // TODO: validate url + ensure valid pathname + remove querystring
    .chain(getRoute)
    // should this concern be in the Router?
    .chain(({ handler, params }) => handler(params))
    .toNullable();

class DevServer implements ServerInterface {
  private readonly httpServer: http.Server;

  constructor(private readonly compiler: Compiler) {
    this.httpServer = http.createServer(
      (req: http.IncomingMessage, res: http.ServerResponse): void => {
        /**
         * HACK it together for now
         */
        const r = resolveRouteResponse(req.url);
        this.compiler.whenReady(() => {
          if (r == null) {
            res.statusCode = 404;
            return res.end();
          }

          res.writeHead(200, r.headers);
          r.body.pipe(res);
        });
      }
    );
  }

  start(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.httpServer.once('error', reject);
      this.httpServer.once('listening', () => resolve());
      this.httpServer.listen(3000);
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

export function createDevServer(/* port: number */) {
  const compiler = new Compiler();
  return new DevServer(compiler);
}
