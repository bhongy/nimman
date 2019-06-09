/**
 * RouteMatcher.
 *
 * Simple many-to-one mapper (resolver)
 * from an actual pathname (such as '/user/18303230')
 * to a handler function and a params record.
 *
 * pathname1 \
 * pathname2 - f -> (handler, params)
 * pathnaem3 /
 *
 * Stateless.
 * I/O ignorant.
 */

import * as $Array from 'fp-ts/lib/Array';
import { Option, fromNullable } from 'fp-ts/lib/Option';
import RouteParser = require('route-parser');

export type Params = StrictRecord<string, string>;

class MatchedRoute<T> {
  constructor(
    readonly pathname: string,
    readonly handler: T,
    readonly params: Params
  ) {}
}

const isParamsPattern = (pattern: string) => /\/\:\w+/.test(pattern);

type RouteMatcher<T extends Function> =
  // (pathname: ValidUrl.pathname): Route;
  (pathname: string) => Option<MatchedRoute<T>>;

// this can be largely simplified if use TrieRouteMatcher O(M) lookup
// which is efficient for both exact and params
export const routeMatcher = <T extends Function>(routesMapping: {
  [pattern: string]: T;
}): RouteMatcher<T> => {
  const exactRoutesMapping = new Map(
    Object.entries(routesMapping).filter(([k]) => !isParamsPattern(k))
  );

  const paramsRoutesMapping = Object.entries(routesMapping)
    .filter(([k]) => isParamsPattern(k))
    .map(
      <T>([pattern, handler]: [string, T]): [RouteParser, T] => [
        new RouteParser(pattern),
        handler,
      ]
    );

  return pathname =>
    fromNullable(exactRoutesMapping.get(pathname))
      .map(handler => new MatchedRoute(pathname, handler, {}))
      .orElse(() =>
        $Array
          .findFirst(paramsRoutesMapping, ([route]) => !!route.match(pathname))
          .map(([route, handler]) => {
            const params = route.match(pathname) || {};
            return new MatchedRoute(pathname, handler, params);
          })
      );
};
