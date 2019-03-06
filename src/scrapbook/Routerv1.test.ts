import { Router } from './Routerv1';

describe('Router', () => {
  it('returns matched route', () => {
    expect.assertions(3);

    const path = '/foo/bar';
    const foobarHandler = jest.fn();
    const router = new Router([
      { pattern: '/foo/:id', handler: foobarHandler },
      { pattern: '/fizz', handler() {} },
    ]);

    const route = router.match(path);

    if (route != null) {
      route.handler('dummy');
      expect(route.pattern).toEqual('/foo/:id');
      expect(route.handler).toHaveBeenCalledTimes(1);
      expect(route.handler).toHaveBeenCalledWith('dummy');
    }
  });

  it('returns matched handler', () => {
    expect.assertions(2);

    const path = '/foo/bar';
    const foobarHandler = jest.fn();
    const router = new Router([
      { pattern: '/foo/(.*)', handler: foobarHandler },
      { pattern: '/fizz', handler() {} },
    ]);

    const handler = router.handlerOf(path);

    handler('dummy');
    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler).toHaveBeenCalledWith('dummy');
  });
});
