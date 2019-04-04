import { URL } from 'url';
import { Option, tryCatch } from 'fp-ts/lib/Option';

const of = (maybePathname: string): Option<URL> =>
  tryCatch(() => new URL(maybePathname));

export const Url = { of };
