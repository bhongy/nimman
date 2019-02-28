import { headers } from './ResponseHeaders';

test('headers', () => {
  expect(headers).toEqual({
    'Cache-Control': 'public, max-age=31536000, immutable',
    'Content-Length': '100',
    'Content-Type': 'text/html; charset=utf-8',
  });
});
