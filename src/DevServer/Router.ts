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
import { renderPage } from './PageRenderer';
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

// TODO: figure out a way to generalize `pageHandler`
// so we don't create closure for each page
const pageHandler = (page: string): Handler => () =>
  option.of(renderPage(page)).map(body => ({
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
    body,
  }));

export const getRoute = routeMatcher<Handler>({
  '/static/:filename': staticFileHandler,
  '/': pageHandler('inbox'),
  '/message': pageHandler('message'),
  '/404': pageHandler('404'),
});
