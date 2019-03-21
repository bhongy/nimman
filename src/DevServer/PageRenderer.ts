/**
 * `serverRender.js` is not ready until webpack server compilation finished
 * this needs to be refactored so that it's part of the compilation life-cycle
 *
 * Boundary.
 * ... I/O aware. "Project" structure aware.
 */
import { Readable as ReadableStream } from 'stream';
import * as Project from './__Config'; // TEMPORARY
import * as path from 'path';

const RENDERER_PATH = path.resolve(Project.dist, 'serverRender.js');

// TODO: improve type safety
// since this reads from disk, we cannot guarantee
// that it is a function that will return ReadableStream
export const renderPage = (page: string): ReadableStream =>
  // don't wrap in try-catch or `fromNullable`, etc
  // if there's an error loading "render" file from project (or bad export)
  // we let the entire DevServer crashes for now
  // ---
  // in the future, we can make the server start to catch errors from loading
  // "render" function (from project) and wait for user to fix the error
  // then the fix will picked up by hot loader and start working
  // without needing to restart the server
  require(RENDERER_PATH).render(page);
