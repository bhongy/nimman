jest.mock('./StaticAssetAdapter');

// import { streamToString } from '../scrapbook/StreamUtils';
import { handler } from './StaticAssetHandler';

describe('StaticAssetHandler', () => {
  describe('request existing files', () => {
    it('returns Task<FileExisted> response', async () => {
      const filename = 'should-find.txt';
      const result = await handler({ filename }).run();
      expect(result.statusCode).toBe(200);
    });
  });

  describe('request non-existing files', () => {
    it('returns Task<FileNotFound> response',async () => {
      const filename = 'should-not-find-this-file.abc';
      const result = await handler({ filename }).run();
      expect(result.statusCode).toBe(404);
    });
  });
});
