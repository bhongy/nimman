import { Readable } from 'stream';

export const fromString = (s: string): Readable =>
  new Readable({
    read() {
      this.push(s);
      this.push(null);
    },
  });

export const toString = (r: Readable): Promise<string> =>
  new Promise((resolve, reject) => {
    let str = '';
    r.on('error', reject);
    r.on('data', data => {
      str += data.toString();
    });
    r.on('end', () => resolve(str));
  });
