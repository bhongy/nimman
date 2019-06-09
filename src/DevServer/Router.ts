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
import { Task, task } from 'fp-ts/lib/Task';
import { Readable as ReadableStream } from 'stream';
import { handler as staticAssetHandler } from './StaticAssetHandler';
import { renderPage } from './PageRenderer';
import { routeMatcher, Params } from '../lib/RouteMatcher';
import { createSingletonStream } from '../scrapbook/StreamUtils';

/**
 * Response interface enforces contract that the caller is guaranteed
 * to have access these properties and can make assumption how to transform
 * or send it over the wire
 *
 * Q: should use `NimmanServer.Response` as the output position?
 *    PageResponse | FileResponse
 *
 * This model is probably wrong because RedirectResponse doesn't have body
 */
export interface Response {
  readonly statusCode: 200 | 404;
  readonly headers: { 'Content-Type': string };
  readonly body: ReadableStream;
}

// consider as an implementation detail (internal) of the Router
// Router delegates Response creation to an instance of Handler
export interface Handler {
  (params: Params): Task<Response>;
}

// a different idea: instead of Handler we use Route
// which is a union of different Route types
// e.g. InboxRoute { handler: () => ... }
// e.g. MessageRoute { messageId: string, handler: (messageId: string) => ... }
// https://github.com/gcanti/fp-ts-routing (read source)

const goodPageResponse = (body: ReadableStream): Response => ({
  statusCode: 200,
  headers: { 'Content-Type': 'text/html' },
  body,
});

// ! leak knowledge about webpack - should take `PageRoute` or something instead
// TEMPORARY: its design is going to change a lot to support server-side render
const pageHandler = (entryChunkname: string): Handler => () =>
  task.of(renderPage(entryChunkname)).map(goodPageResponse);

// type Route = [string /* pattern */, Handler];

const matcher = routeMatcher({
  '/static/:filename': staticAssetHandler, // is this a "route"?
  // idea: multi-layer routing? if it's a page -> delegate to page "router"
  '/': pageHandler('inbox'),
  '/message': pageHandler('message'),
  '/404': pageHandler('404'),
});

/*
const matcher2 = [
  StaticFileRoute, // { pattern: '/static/:filename' }
  Page({ pattern: '/', entryChunkname: 'inbox' }) --> Page will give handler that calls with no params but uses entryChunkname
]
*/

// TEMPORARY: the URL type currently represents the request
// this should be a dedicate `NimmanServer.Request` type
// that captures all information about the request including user, session, etc.
namespace NimmanServer {
  export type Request = URL;
  // export type Response =
  //   | HtmlDocumentResponse
  //   | StaticFileResponse
  //   | NotFoundResponse;
}

class NotFoundResponse implements Response {
  readonly statusCode = 404;
  readonly headers = { 'Content-Type': 'text/plain' };
  readonly body = createSingletonStream('file not found');
}

// Request -> Handler -> Response
// encapsulate knowledge of "Route" without leaking to the next level
// - call handler with params
// - ** guarantees to "always" return a response
export const resolveResponse = (
  request: NimmanServer.Request
): Task<Response> =>
  // > hard-coded dependency: `matcher`
  matcher(request.pathname).foldL(
    () => task.of(new NotFoundResponse()),
    ({ handler, params }) => handler(params)
  );

// ---

class RedirectResponse {
  readonly statusCode = 302;
  readonly headers: { Location: string };

  // make `redirectTo` a safer type -> a valid URL destination
  constructor(redirectTo: string) {
    this.headers = { Location: redirectTo };
  }
}
