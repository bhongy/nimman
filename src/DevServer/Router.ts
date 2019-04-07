/**
 * v0 (work in progress)
 *
 * Router Design:
 * - has an opinion about what the response should be in good/bad cases
 *   i.e. it "routes" that is responsible in making decision about
 *   - invalid URL -> 404
 *   - redirection e.g. after log in, require login, fallback
 * - does NOT calculate (e.g. build response) it just "knows people"
 *   and merely delegates to appropriate domain models/services
 * - does NOT do work itself - so this might mean it will spawn "Task"s?
 *
 * Handler Design:
 * - a Handler is an "adapter" (thin) that connects a route to the underlying
 *   domain model/service
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
import { handler as staticAssetHandler } from './StaticAssetHandler';
import { renderPage } from './PageRenderer';
import { routeMatcher, Params } from '../lib/RouteMatcher';
export { Params } from '../lib/RouteMatcher';

interface Router {
  // (url: URL): Task<Response>; // (async, lazy, can fail)
  (url: URL): Option<Response>;
}

// PageResponse, FileResponse
interface Response {
  readonly statusCode: 200 | 404;
  readonly headers: { 'Content-Type': string };
  readonly body: ReadableStream;
}

// consider as an implementation detail (internal) of the Router
// Router delegates Response creation to an instance of Handler
export interface Handler {
  (params: Params): Option<Response>;
}

const goodPageResponse = (body: ReadableStream): Response => ({
  statusCode: 200,
  headers: { 'Content-Type': 'text/html; charset=utf-8' },
  body,
});

// ! leak knowledge about webpack
// TEMPORARY: its design is going to change a lot to support server-side render
const pageHandler = (entryChunkname: string): Handler => () =>
  option.of(renderPage(entryChunkname)).map(goodPageResponse);

// type Route = [string /* pattern */, Handler];

// idea: multi-layer routing?
// if it's a page -> delegate to page "router"
const matcher = routeMatcher({
  '/static/:filename': staticAssetHandler, // is this a "route"?
  '/': pageHandler('inbox'),
});

/*
const matcher2 = [
  StaticFileRoute, // { pattern: '/static/:filename' }
  Page({ pattern: '/', entryChunkname: 'inbox' }) --> Page will give handler that calls with no params but uses entryChunkname
]
*/

export const resolveResponse: Router = (url: URL): Option<Response> =>
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
