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

import * as Project from './__Config'; // TEMPORARY
import * as path from 'path';

const pageHandler = (page: string): Handler => () =>
  some(path.resolve(Project.dist, 'serverRender.js'))
    // don't wrap in tryCatch or fromNullable
    // because if this "require" causes an error
    // we should crash the process
    .map(p => require(p).render)
    .map(render => ({
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
      body: render(page),
    }));

export const getRoute = routeMatcher<Handler>({
  '/static/:filename': staticFileHandler,
  '/': pageHandler('inbox'),
  '/message': pageHandler('message'),
  '/404': pageHandler('404'),
});
