// import { Maybe } from 'data-ts';
import { Option, fromNullable } from 'fp-ts/lib/Option';
import RouteParser = require('route-parser');

type Route<T extends Function> = ExactMatchedRoute<T> | ParamsMatchedRoute<T>;
type Params = Record<string, string>;

class ExactMatchedRoute<T> {
  constructor(readonly handler: T, readonly pathname: string) {}
}

// export const isExactRoute

class ParamsMatchedRoute<T> {
  constructor(
    readonly handler: T,
    // this could be typed better
    readonly params: Params,
    readonly pathname: string
  ) {}
}

export const isParamsRoute = <T extends Function>(
  route: Route<T>
): route is ParamsMatchedRoute<T> => route instanceof ParamsMatchedRoute;

// ...

// Use class because we'll have a couple rules like:
// - can it start with params
// - does it make sense to have multiple param sections like `/foo/:bar/:baz`
const LOOK_LIKE_PARAMS_PATH_REGEX = /\/\:\w+/;
class ParamsPathPattern {
  static test(pathname: string): boolean {
    return LOOK_LIKE_PARAMS_PATH_REGEX.test(pathname);
  }

  private readonly parser: RouteParser;
  // private readonly regexp: RegExp;
  // private readonly key: string;

  constructor(pattern: string) {
    // const keys: Array<{ name: string }> = [];
    // this.regexp = pathToRegexp(pattern, []);
    // this.key = keys.map(({ name }) => name)[0];
    this.parser = new RouteParser(pattern);
  }

  test(pathname: string): boolean {
    return !!this.parser.match(pathname);
  }

  parseParams(pathname: string): Params {
    return this.parser.match(pathname) || {};
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
      <T>([pattern, handler]: [string, T]): [ParamsPathPattern, T] => [
        new ParamsPathPattern(pattern),
        handler,
      ]
    );

  return pathname =>
    fromNullable(exactRoutesMapping.get(pathname))
      .map(handler => new ExactMatchedRoute(handler, pathname))
      .orElse(() =>
        fromNullable(
          paramsRoutesMapping.find(([pattern]) => pattern.test(pathname))
        ).map(([pattern, handler]) => {
          const params = pattern.parseParams(pathname);
          return new ParamsMatchedRoute(handler, params, pathname);
        })
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
