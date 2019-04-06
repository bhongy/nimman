/**
 * ... Router has opinion about what the response should be in good/bad cases
 *
 * ... we can think of ReadableStream as an Observable of sort (async events)
 *   so we don't deal with async/await/promise because we use a different
 *   async primitive
 *
 * Pure.
 * Aware of Node streams, http headers
 * but not allow to cause side-effects.
 *
 * [TODO] refactor so it's testable
 */
import { Option, option, fromNullable } from 'fp-ts/lib/Option';
import { Readable as ReadableStream } from 'stream';
import { requestStaticAsset } from './StaticAssetService';
import { renderPage } from './PageRenderer';
import { routeMatcher, Params } from '../lib/RouteMatcher';

interface Router {
  // (url: URL): Task<Response>; // (async)
  (url: URL): Option<Response>;
}

// PageResponse, FileResponse
interface Response {
  readonly statusCode: 200 | 404;
  readonly headers: { 'Content-Type': string };
  readonly body: ReadableStream;
}

// internal implementation
// Router delegates Response creation to an instance of Handler
interface Handler {
  (params: Params): Option<Response>;
}

const goodStaticFileResponse = (body: ReadableStream): Response => ({
  statusCode: 200,
  headers: { 'Content-Type': 'text/javascript; charset=utf-8' },
  body,
});

// this will get larger as we generalize to handle more MIME types
// TODO: split into it's own module
const staticFileHandler = (params: Params): Option<Response> =>
  fromNullable(params.filename)
    .chain(requestStaticAsset)
    .map(goodStaticFileResponse);

const goodPageResponse = (body: ReadableStream): Response => ({
  statusCode: 200,
  headers: { 'Content-Type': 'text/html; charset=utf-8' },
  body,
});

const pageHandler = (entryChunkname: string): Handler => () =>
  option.of(renderPage(entryChunkname)).map(goodPageResponse);

// type Route = [string /* pattern */, Handler];

const matcher = routeMatcher({
  '/static/:filename': staticFileHandler, // is this a "route"?
  '/': pageHandler('inbox'),
});

/*
const matcher2 = [
  StaticFileRoute, // { pattern: '/static/:filename' }
  Page({ pattern: '/', entryChunkname: 'inbox' }) --> Page will give handler that calls with no params but uses entryChunkname
]
*/

export const resolveResponse /*: Router */ = (url: URL): Option<Response> =>
  // > hard-coded dependency: `matcher`
  matcher(url.pathname).chain(({ params, handler }) => handler(params));

// ---

class RedirectResponse {
  readonly statusCode = 302;
  readonly headers: { Location: string };

  // make `redirectTo` a safer type -> a valid URL destination
  constructor(redirectTo: string) {
    this.headers = { Location: redirectTo };
  }
}

class NotFoundResponse {
  readonly statusCode = 404;
}
