/**
 * a thin boundary entity - think of this as a service
 * that we make a request _to_ so the caller can be I/O ignorant
 * it could as well go out to CDN for all we care
 *
 * interface: returns TaskEither (async, can fail with a reason) of "content"
 * caller is responsible to decide what to do in differetn failure reasons
 * caller could decide to generalize all errors as "not found"
 * but this (the Adapter) should report boundary failure reasons as-is
 * i.e. this layer is _not_ where we drop/mask failure information
 *
 * Boundary. [TODO] create __mocks__
 * I/O aware.
 */
import * as Project from './__Config'; // TEMPORARY
import * as fs from 'fs';
import * as path from 'path';
import * as stream from 'stream';
import { TaskEither, tryCatch } from 'fp-ts/lib/TaskEither';

type RequestFileFailure = FileNotFound | UpstreamTimeout;

// TEMPORARY interface
export class FileNotFound {
  readonly name = 'FileNotFound';
  toString(): string {
    return 'file not found';
  }
}

// TEMPORARY interface
export class UpstreamTimeout {
  readonly name = 'UpstreamTimeout';
  toString(): string {
    return 'upstream service is timing out';
  }
}

// `filename` is something like `message.js` (not a path)
export const requestFile = (
  filename: string
): TaskEither<RequestFileFailure, stream.Readable> =>
  tryCatch(
    () =>
      new Promise((resolve, reject) => {
        const filepath = path.join(Project.dist, filename);
        fs.access(filepath, fs.constants.R_OK, err => {
          err ? reject(err) : resolve(fs.createReadStream(filepath));
        });
      }),
    // TODO: do _not_ make all failures FileNotFound
    () => new FileNotFound()
  );

// rename to OnDiskWebpackBundleAdapter implements StaticAssetAdapter ?
