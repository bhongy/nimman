import { fromNullable } from 'fp-ts/lib/Option';
import { Handler } from './Router';
import { requestFile } from './StaticAssetAdapter';

// staticFileAdapter -> Content(Body)Stream
// staticFileHandler -> Response

export const tempHandler = ({ filename }: { filename: string }) =>
  requestFile(filename);

// Q: is it okay to know how it's get called by router i.e. `params.filename`?
export const handler: Handler = params =>
  fromNullable(params.filename)
    .chain(requestFile)
    .map(function goodResponse(body) {
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'text/javascript; charset=utf-8' },
        body,
      };
    });
// otherwise(StaticFile.NotFound /*: Response */)
