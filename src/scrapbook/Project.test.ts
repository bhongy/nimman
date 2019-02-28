import { root } from './Project';

describe('project constant', () => {
  describe('.root', () => {
    it('returns configured project root', () => {
      expect(root).toBe('/root');
    });
  });
});
