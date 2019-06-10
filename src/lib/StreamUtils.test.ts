import { Readable } from 'stream';
import { fromString, toString } from './StreamUtils';

describe('StreamUtils', () => {
  describe('fromString', () => {
    it('creates a readable stream from a string', () => {
      const r = fromString('Alan Turing, Edsger W. Dijkstra, Tony Hoare').setEncoding('utf-8');
      expect(r.read(13)).toEqual('Alan Turing, ');
      expect(r.read()).toEqual('Edsger W. Dijkstra, Tony Hoare');
    });
  });

  describe('toString', () => {
    it('buffers the readable stream to a (promise) string', async () => {
      const r = new Readable({
        read() {
          setImmediate(() => {
            this.push('Alan Turing, ');
            this.push('Edsger W. Dijkstra, ');
            this.push('Tony Hoare');
            this.push(null);
          });
        },
      });

      const s = await toString(r);
      expect(s).toEqual('Alan Turing, Edsger W. Dijkstra, Tony Hoare');
    });
  });

  describe('fromString -> toString (isomorphism)', () => {
    it('returns the promise that resolves to original string', async () => {
      const original = 'Leslie Lamport';
      const result = await toString(fromString(original));
      expect(result).toEqual(original);
    });
  });

  describe('toString -> fromString (isomorphism)', () => {
    test('returns the stream that contains content of the original stream', async () => {
      const original = new Readable({
        read() {
          this.push('Alan Kay');
          this.push(null);
        },
      });

      const result = fromString(await toString(original)).setEncoding('utf-8');
      expect(result.read()).toEqual('Alan Kay');
    });
  });
});
