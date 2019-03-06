// import { Maybe } from 'data-ts';
import { Option, fromNullable } from 'fp-ts/lib/Option';
import { identity } from 'fp-ts/lib/function';
import * as pathToRegexp from 'path-to-regexp';

type Route<T extends Function> = ExactMatchedRoute<T> | ParamsMatchedRoute<T>;

class ExactMatchedRoute<T> {
  constructor(readonly handler: T, readonly pathname: string) {}
}

class ParamsMatchedRoute<T> {
  constructor(
    readonly handler: T,
    // this could be typed better
    readonly params: { [key: string]: string },
    readonly pathname: string
  ) {}
}

// ...

// Use class because we'll have a couple rules like:
// - can it start with params
// - does it make sense to have multiple param sections like `/foo/:bar/:baz`
const LOOK_LIKE_PARAMS_PATH_REGEX = /\/\:\w+/;
class ParamsPathPattern {
  static test(pathname: string): boolean {
    return LOOK_LIKE_PARAMS_PATH_REGEX.test(pathname);
  }
}

type RouteMatcher<T extends Function> =
  // (pathname: ValidUrl.pathname): Route;
  (pathname: string) => Option<Route<T>>;

export const routeMatcher = <T extends Function>(routesMapping: {
  [pattern: string]: T;
}): RouteMatcher<T> => {
  const exactRoutesMapping = new Map(
    Object.entries(routesMapping).filter(([k]) => !ParamsPathPattern.test(k))
  );

  const paramsRoutesMapping = Object.entries(routesMapping)
    .filter(([k]) => ParamsPathPattern.test(k))
    .map(
      <T>([pattern, handler]: [string, T]): [RegExp, T] => [
        pathToRegexp(pattern),
        handler,
      ]
    );

  return pathname =>
    fromNullable(exactRoutesMapping.get(pathname))
      .map(handler => new ExactMatchedRoute(handler, pathname))
      .orElse(() =>
        fromNullable(
          paramsRoutesMapping.find(([regexp]) => regexp.test(pathname))
        ).map(([, handler]) => new ParamsMatchedRoute(handler, {}, pathname))
      );
};

// ...

/*
function ensurePathname(maybePathname: string) {

}

class Pathname {
  constructor(maybePathname: string) {
    try {
      const validUrl = new URL(maybePathname);
    }
    // validate URL
  }
}
*/
