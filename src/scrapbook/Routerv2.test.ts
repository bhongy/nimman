import { routeMatcher } from './Routerv2';

describe('RouterV2', () => {
  it('match exact routes', () => {
    expect.assertions(3);

    const foobarHandler = jest.fn();
    const matchRoute = routeMatcher({
      '/foo/bar': foobarHandler,
      '/fizz'() {},
    });

    jest.clearAllMocks();
    // does not partially match
    matchRoute('/foo').map(route => {
      route.handler();
    });

    expect(foobarHandler).toHaveBeenCalledTimes(0);

    jest.clearAllMocks();
    matchRoute('/foo/bar').map(route => {
      route.handler();
      expect(route.pathname).toEqual('/foo/bar');
    });

    expect(foobarHandler).toHaveBeenCalledTimes(1);
  });

  it('matches params routes if no exact match', () => {
    const foobarHandler = jest.fn();
    const paramsFooHandler = jest.fn();
    const matchRoute = routeMatcher({
      '/foo/bar': foobarHandler,
      '/foo/:b': paramsFooHandler,
      '/fizz'() {},
    });

    jest.clearAllMocks();
    matchRoute('/foo').map(route => {
      route.handler();
    });

    expect(foobarHandler).toHaveBeenCalledTimes(0);
    expect(paramsFooHandler).toHaveBeenCalledTimes(0);

    jest.clearAllMocks();
    // doesn't match both and match exact first
    matchRoute('/foo/bar').map(route => {
      route.handler();
    });

    expect(foobarHandler).toHaveBeenCalledTimes(1);
    expect(paramsFooHandler).toHaveBeenCalledTimes(0);

    jest.clearAllMocks();
    matchRoute('/foo/stuff').map(route => {
      route.handler();
      expect(route.pathname).toEqual('/foo/stuff');
      // expect(route.params).toEqual({ b: 'stuff' });
    });

    expect(foobarHandler).toHaveBeenCalledTimes(0);
    expect(paramsFooHandler).toHaveBeenCalledTimes(1);
  });

  // it('parses params from route');
});
