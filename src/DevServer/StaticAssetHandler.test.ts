jest.mock('./StaticAssetAdapter');

import { streamToString } from '../scrapbook/StreamUtils';
import { handler } from './StaticAssetHandler';

describe('StaticAssetHandler', () => {
  describe('request existing files', () => {
    it('returns Task<FileExisted> response', async () => {
      expect.assertions(2);
      const filename = 'should-find.txt';
      const res = await handler({ filename }).run();
      expect(res.statusCode).toBe(200);
      expect(await streamToString(res.body)).toBe(
        'fakeContent from should-find.txt'
      );
    });
  });

  describe('request non-existing files', () => {
    it('returns Task<FileNotFound> response', async () => {
      expect.assertions(2);
      const filename = 'should-not-find-this-file.abc';
      const res = await handler({ filename }).run();
      expect(res.statusCode).toBe(404);
      // temporary
      expect(await streamToString(res.body)).toBe('file not found');
    });
  });
});
