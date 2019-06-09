import { task } from 'fp-ts/lib/Task';
import { fromNullable as eitherFromNullable } from 'fp-ts/lib/Either';
import { Readable as ReadableStream } from 'stream';
import { createSingletonStream } from '../../scrapbook/StreamUtils';

const fakeFileSystem: Record<string, ReadableStream> = {
  'should-find.txt': createSingletonStream('fakeContent from should-find.txt'),
};

const notFoundIfNullable = eitherFromNullable(
  createSingletonStream('file not found')
);

export const requestFile = (filename: string) =>
  task.of(fakeFileSystem[filename]).map(notFoundIfNullable);
