import { Option, fromEither } from 'fp-ts/lib/Option';
import { tryCatch } from 'fp-ts/lib/Either';

function ensurePathname(maybePathname: string): Option<Pathname> {
  return fromEither(tryCatch(() => new URL(maybePathname))).map(url => new Pathname(url.pathname));
}

class Pathname {
  constructor(private readonly pathname: string) {}
}
