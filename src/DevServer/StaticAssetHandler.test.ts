jest.mock('./StaticAssetAdapter');

import { Option, none } from 'fp-ts/lib/Option';
import { Readable as ReadableStream } from 'stream';
// import { requestFile } from './StaticAssetAdapter';
import { streamToString } from '../scrapbook/StreamUtils';
import { tempHandler as handler } from './StaticAssetHandler';

describe('StaticAssetHandler', () => {
  describe('request existing files', () => {
    it('returns Some(ContentStream) of the file', async () => {
      expect.assertions(2);

      const re1 = await handler({ filename: 'should-find.txt' })
        .map(streamToString)
        .toNullable();

      expect(re1).toBe('fakeContent from should-find.txt');

      const re2 = await handler({ filename: 'foobar.js' })
        .map(streamToString)
        .toNullable();

      expect(re2).toBe('fake js content');
    });
  });

  describe('request non-existing files', () => {
    it('returns None', () => {
      const result = handler({ filename: 'should-not-find-this-file.abc' });
      expect(result).toEqual(none);
    });
  });
});
