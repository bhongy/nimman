/**
 * a thin boundary entity - think of this as a service
 * that we make a request to so the caller can be I/O ignorant
 * it could as well go out to CDN for all we care
 *
 * Boundary.
 * I/O aware.
 */
import * as Project from './__Config'; // TEMPORARY
import * as fs from 'fs';
import * as path from 'path';
import { Readable as ReadableStream } from 'stream';
import { Option, option, tryCatch } from 'fp-ts/lib/Option';

// `filename` is something like `message.js` (not a path)
export const requestStaticAsset = (filename: string): Option<ReadableStream> =>
  option
    .of(path.resolve(Project.dist, filename))
    .chain(filepath => tryCatch(() => fs.createReadStream(filepath)));
