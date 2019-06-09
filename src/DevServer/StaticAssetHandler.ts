import { fromNullable } from 'fp-ts/lib/Option';
import { task } from 'fp-ts/lib/Task';
import { Readable as ReadableStream } from 'stream';
import { Handler, Response } from './Router';
import { requestFile } from './StaticAssetAdapter';
import { createSingletonStream } from '../scrapbook/StreamUtils';
import { identity } from 'fp-ts/lib/function';

// staticFileAdapter -> Content(Body)Stream
// staticFileHandler -> Response

// data Response = GoodResponse | BadResponse
// staticFileHandler :: Filename -> Task Response

export class FileExisted implements Response {
  readonly statusCode = 200;
  readonly headers = { 'Content-Type': 'plain/text' };
  constructor(readonly body: ReadableStream) {}
}

const fileExisted = (body: ReadableStream) => new FileExisted(body);

export class FileNotFound implements Response {
  readonly statusCode = 404;
  readonly headers = { 'Content-Type': 'plain/text' };
  readonly body = createSingletonStream('file not found');
}

const fileNotFound = new FileNotFound();

// Q: is it okay to know how it's get called by router i.e. `params.filename`?
export const handler: Handler = params =>
  fromNullable(params.filename).fold(task.of(fileNotFound), filename =>
    requestFile(filename).map(result =>
      result.fold<Response>(() => fileNotFound, fileExisted)
    )
  );
// otherwise(StaticFile.NotFound /*: Response */)
