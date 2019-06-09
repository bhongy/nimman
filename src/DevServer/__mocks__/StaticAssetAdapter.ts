import * as stream from 'stream';
import { fromNullable } from 'fp-ts/lib/Either';
import { taskEither } from 'fp-ts/lib/TaskEither';
import { createSingletonStream } from '../../scrapbook/StreamUtils';

const { FileNotFound } = jest.requireActual('../StaticAssetAdapter');

const fakeFileSystem: StrictRecord<string, stream.Readable> = {
  'should-find.txt': createSingletonStream('fakeContent from should-find.txt'),
};

const notFoundIfNullable = fromNullable(new FileNotFound());

// TODO: how to keep this in-sync with the actual interface?
export const requestFile = (filename: string) =>
  taskEither.fromEither(notFoundIfNullable(fakeFileSystem[filename]));
