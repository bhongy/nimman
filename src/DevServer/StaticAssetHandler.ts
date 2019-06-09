/**
 * staticFileHandler :: Filename -> Task Response
 * staticFileAdapter :: Filename -> TaskEither Failure Content(Body)Stream
 *
 * data Response = GoodResponse | BadResponse
 */

import * as stream from 'stream';
import { fromNullable } from 'fp-ts/lib/Option';
import { task } from 'fp-ts/lib/Task';
import * as Router from './Router';
import { requestFile } from './StaticAssetAdapter';
import { createSingletonStream } from '../scrapbook/StreamUtils';

class FileExisted implements Router.Response {
  readonly statusCode = 200;
  readonly headers = { 'Content-Type': 'plain/text' };
  constructor(readonly body: stream.Readable) {}
}

class FileNotFound implements Router.Response {
  readonly statusCode = 404;
  readonly headers = { 'Content-Type': 'plain/text' };
  readonly body = createSingletonStream('file not found');
}

type StaticFileResponse = FileExisted | FileNotFound;

const fileExisted = (body: stream.Readable) => new FileExisted(body);
const fileNotFound = () => new FileNotFound();

// Q: is it okay to know how it's get called by router i.e. `params.filename`?
export const handler: Router.Handler = params =>
  fromNullable(params.filename)
    // : Option<Task<Response>>
    .map(filename =>
      requestFile(filename).fold<StaticFileResponse>(fileNotFound, fileExisted)
    )
    // : Task<Response>
    .getOrElseL(() => task.of(fileNotFound()));
// otherwise(StaticFile.NotFound /*: Response */)
