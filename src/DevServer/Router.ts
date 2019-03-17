// aware of Node streams, http headers
// but not allow to cause side-effects

import { Option, some } from 'fp-ts/lib/Option';
import { Readable as ReadableStream } from 'stream';
import { staticAssetProvider } from './StaticAssetProvider';
import { routeMatcher } from '../lib/RouteMatcher';

interface Handler {
  (params: Record<string, string>): Option<{
    headers: { 'Content-Type': string };
    body: ReadableStream;
  }>;
}

// TODO: make it safer, params lookup for `filename` is nullable
const staticFileHandler: Handler = ({ filename }) =>
  staticAssetProvider.request(filename).map(body => ({
    headers: { 'Content-Type': 'text/javascript; charset=utf-8' },
    body,
  }));

const createSingletonStream = (content: string) => {
  const stream = new ReadableStream();
  stream.push(content);
  stream.push(null);
  return stream;
};

const homepageHtml = `<!DOCTYPE html><html><head><title>Nimman</title><link rel="shortcut icon" href="data:image/x-icon;," type="image/x-icon"></head><body><script src="/static/main.js"></script></body></html>`;
const pageHandler = (html: string): Handler => () =>
  some({
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
    body: createSingletonStream(html),
  });

export const getRoute = routeMatcher({
  '/static/:filename': staticFileHandler,
  '/': pageHandler(homepageHtml),
});
