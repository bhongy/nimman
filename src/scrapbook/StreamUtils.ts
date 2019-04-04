import { Readable as ReadableStream } from 'stream';

export const createSingletonStream = (content: string): ReadableStream =>
  new ReadableStream({
    read() {
      this.push(content);
      this.push(null);
    },
  });

export const streamToString = (stream: ReadableStream): Promise<String> =>
  new Promise((resolve, reject) => {
    let str = '';
    stream.on('error', reject);
    stream.on('data', data => {
      str += data.toString();
    });
    stream.on('end', () => resolve(str));
  });
