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
 * Boundary.
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

/**
 * TaskEither-ify of fs.access.
 *
 * @param filepath an _absolute_ path on the file system
 * @param mode fs.constants (File Access Constants)
 * https://nodejs.org/docs/latest-v8.x/api/fs.html#fs_fs_constants_1
 *
 * In success case, returns the input filepath as-is
 * so the caller doesn't have to keep it in scope.
 */
const checkFileAccess = (
  filepath: string,
  mode: number
): TaskEither<NodeJS.ErrnoException, string> =>
  tryCatch(
    () =>
      new Promise((resolve, reject) => {
        fs.access(filepath, mode, e => (e ? reject(e) : resolve(filepath)));
      }),
    // Promise does not passthrough type of the reason for rejection
    // TODO: use `infer` to thread through the `error` type
    e => e as NodeJS.ErrnoException
  );

// `filename` is something like `message.js` (not a path)
export const requestFile = (
  filename: string
): TaskEither<RequestFileFailure, stream.Readable> =>
  checkFileAccess(path.join(Project.dist, filename), fs.constants.R_OK).bimap(
    // TODO: do _not_ make all failures FileNotFound
    () => new FileNotFound(),
    fs.createReadStream
  );

// rename to OnDiskWebpackBundleAdapter implements StaticAssetAdapter ?
