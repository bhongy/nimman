import { createSingletonStream, streamToString } from './StreamUtils';

describe('streamToString', () => {
  it('returns promise of entire stream content', () => {
    const content = '<html><head><title>..............';
    const stream = createSingletonStream(content);
    return expect(streamToString(stream)).resolves.toEqual(content);
  });
});
