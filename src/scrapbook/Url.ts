import { URL } from 'url';
import { Option, tryCatch } from 'fp-ts/lib/Option';

// TEMPORARY
export const validateUrl = (maybePathname: string): Option<URL> =>
  tryCatch(() => new URL(maybePathname, 'http://localhost:3000'));
