/**
 * A way to match a Route given a Path.
 *
 * Purpose:
 *
 * Design:
 * - ensure i/o ignorant
 */

// const createRouteMatcher = (routeConfig) => (pathname: string) =>



import * as pathToRegexp from 'path-to-regexp';

export class Router {
  // private readonly _routes: Array<RouteConfiguration>;
  private readonly _routes: Array<RouteConfiguration & { re: RegExp }>;

  constructor(routeConfigs: Array<RouteConfiguration>) {
    this._routes = routeConfigs.map(({ pattern, handler }) => ({
      re: pathToRegexp(pattern),
      pattern,
      handler,
    }));
  }

  // resolve
  // lookup
  match(path: string) {
    return this._routes.find(({ re }) => re.test(path));
  }

  // matchExact

  handlerOf(path: string) {
    const maybeRoute = this.match(path);
    return maybeRoute == null ? () => {} : maybeRoute.handler;
  }
}

// class Route {}
// class Path {}

// class RouteConfiguration {
//   static of(pattern: string, handler: Function): RouteConfig {
//     return new RouteConfig(pattern, handler);
//   }
//   constructor(readonly pattern: string, readonly handler: Function) {}
// }

interface RouteConfiguration {
  pattern: string;
  handler: Function;
}

/*
class Pathname {
  __pathname: string;

  constructor(maybePathname: string): void {
    // validate pathname
    const validPathname = true; // TEMPORARY
    if (!validPathname) {
      throw new Error();
    }

    this.__pathname = maybePathname;
  }

  toString(): string {
    return this.__pathname;
  }
}

class Success {
  constructor(result: RouteHandler): void {

  }
}

class Failure {
  constructor(pathname: Pathname, reason: string): void {

  }
}

type Result = Success | Failure;

export const Result = { Success, Failure };

type RouteMatcher = () => boolean;
type RouteHandler = () => unknown;
type RoutesConfig = {
  [routeMatcher: ]: RouteHandler,
};

function match(routeConfig: RoutesConfig, pathname: Pathname): Result {

}
*/

/*
import * as Routing from 'routing';

const pathname = new Routing.Pathname('/page/something');
const result = Routing.match(pathname);

if (result instanceof Routing.Result.Success) {
  return result.handler(req, res);
}

if (result instanceof Routing.Result.Failure) {
  // route does not match, respond with 404 or redirect
  return;
}
*/
