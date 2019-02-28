import * as fs from 'fs';
import * as path from 'path';
import * as http from 'http';
import * as webpack from 'webpack';
import { Compiler } from './Compiler';
import { ServerInterface } from '../Server';
import { fstat } from 'fs';

class DevServer implements ServerInterface {
  private readonly httpServer: http.Server;

  constructor(private readonly compiler: Compiler) {
    this.httpServer = http.createServer(
      (req: http.IncomingMessage, res: http.ServerResponse): void => {
        this.compiler.whenReady(() => {
          // serve script
          if (req.url === '/static/main.js') {
            res.statusCode = 200;
            const file = path.resolve(__dirname, '../../example/dist/main.js');
            fs.createReadStream(file).pipe(res);
            return;
          }

          // serve page
          const html = `<!DOCTYPE html><html><head><title>Nimman</title></head><body><script src="/static/main.js"></script></body></html>`;
          res.statusCode = 200;
          res.setHeader('Content-Type', 'text/html; charset=utf-8');
          res.write(html);
          res.end();
        });
      }
    );
  }

  start(): Promise<undefined> {
    return new Promise((resolve, reject) => {
      this.httpServer.once('error', reject);
      this.httpServer.once('listening', () => resolve());
      this.httpServer.listen(3000);
    });
  }

  close(): Promise<undefined> {
    return new Promise((resolve, reject) => {
      this.httpServer.close((err: Error) => (err ? reject(err) : resolve()));
    });
  }

  get buildId() {
    // compilation.hash ?
    return 'development';
  }
}

export function createDevServer(/* port: number */) {
  const compiler = new Compiler();
  return new DevServer(compiler);
}
