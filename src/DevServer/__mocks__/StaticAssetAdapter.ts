import { fromNullable } from 'fp-ts/lib/Option';
import { Readable as ReadableStream } from 'stream';
import { createSingletonStream } from '../../scrapbook/StreamUtils';
import { Option } from 'fp-ts/lib/Option';

const fakeFileSystem: Record<string, ReadableStream> = {
  'should-find.txt': createSingletonStream('fakeContent from should-find.txt'),
};

export const requestFile = (filename: string): Option<ReadableStream> =>
  fromNullable(fakeFileSystem[filename]);
