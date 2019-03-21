/**
 * ... Router has opinion about what the response should be in good/bad cases
 *
 * Pure.
 * Aware of Node streams, http headers
 * but not allow to cause side-effects.
 */
import { Option, option, fromNullable } from 'fp-ts/lib/Option';
import { Readable as ReadableStream } from 'stream';
import { requestStaticAsset } from './StaticAssetProvider';
import { routeMatcher } from '../lib/RouteMatcher';

interface Handler {
  // TODO: add project-wide type constructor `StrictRecord<K,V>`
  (params: Partial<Record<string, string>>): Option<{
    headers: { 'Content-Type': string };
    body: ReadableStream;
  }>;
}

// this will get larger as we generalize to handle more MIME types
// TODO: split into it's own module
const staticFileHandler: Handler = ({ filename }) =>
  fromNullable(filename)
    .chain(requestStaticAsset)
    .map(body => ({
      headers: { 'Content-Type': 'text/javascript; charset=utf-8' },
      body,
    }));

import * as Project from './__Config'; // TEMPORARY
import * as path from 'path';

const pageHandler = (page: string): Handler => () =>
  option
    .of(path.resolve(Project.dist, 'serverRender.js'))
    // don't wrap in tryCatch or fromNullable
    // because if this "require" causes an error
    // we should crash the entire DevServer
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
