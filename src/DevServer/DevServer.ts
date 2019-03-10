/**
 * ... the public interface to interact with Nimman DevServer
 * ... simply fulfill requests (sending out responses) by delegating
 *     to the underlying "services" like the compiler, router
 *
 * Purpose: ?
 *
 * Design: ?
 *
 * Network I/O aware.
 */
import * as fs from 'fs';
import * as path from 'path';
import * as http from 'http';
import { Compiler } from './Compiler';
import { ServerInterface } from '../Server';
import * as Project from './__Config'; // TEMPORARY

class DevServer implements ServerInterface {
  private readonly httpServer: http.Server;

  constructor(private readonly compiler: Compiler) {
    this.httpServer = http.createServer(
      (req: http.IncomingMessage, res: http.ServerResponse): void => {
        this.compiler.whenReady(() => {
          // serve script
          if (req.url === '/static/main.js') {
            res.statusCode = 200;
            const file = path.resolve(Project.dist, 'main.js');
            // TODO: use safe readfile (Either) and 404 when Left
            // e.g. file not found or permission denied
            fs.createReadStream(file).pipe(res);
            return;
          }

          // serve page
          const html = `<!DOCTYPE html><html><head><title>Nimman</title></head><body><script src="/static/main.js"></script></body></html>`;
          res.statusCode = 200;
          res.setHeader('Content-Type', 'text/html; charset=utf-8');
          res.write(html);
          res.end();

          // const { handler } = matchRoute(req.url).fold(routeNotFound, identity);
          // const response = handler({ headers: req.headers });
          // res.writeHead(200, response.headers);
          // res.write(response.body);
          // res.end();
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
