import { Readable as ReadableStream } from 'stream';

const createSingletonStream = content =>
  new ReadableStream({
    read() {
      this.push(content);
      this.push(null);
    },
  });

export const render = (page /*, clientStats */) =>
  createSingletonStream(`
  <!DOCTYPE html>
  <html>
    <head>
      <title>Nimman</title>
      <link rel="shortcut icon" href="data:image/x-icon;," type="image/x-icon">
    </head>
    <body>
      <script src="/static/${page}.js"></script>
    </body>
  </html>
`);
