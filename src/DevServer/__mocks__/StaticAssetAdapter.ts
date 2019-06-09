import * as stream from 'stream';
import { fromNullable } from 'fp-ts/lib/Either';
import { fromEither } from 'fp-ts/lib/TaskEither';
import { createSingletonStream } from '../../scrapbook/StreamUtils';
import {
  FileNotFound,
  requestFile as realRequestFile,
} from '../StaticAssetAdapter';

const fakeFileSystem: Partial<Record<string, stream.Readable>> = {
  'should-find.txt': createSingletonStream('fakeContent from should-find.txt'),
};

const notFoundIfNullable = fromNullable(new FileNotFound());

export const requestFile: typeof realRequestFile = (filename: string) =>
  fromEither(notFoundIfNullable(fakeFileSystem[filename]));
