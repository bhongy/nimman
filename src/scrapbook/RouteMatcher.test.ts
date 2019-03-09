import { routeMatcher } from './RouteMatcher';
import { none } from 'fp-ts/lib/Option';

describe('RouteMatcher', () => {
  describe('exact routes', () => {
    const generalSettingsHandler = () => {};
    const matchRoute = routeMatcher({
      '/'() {},
      '/inbox'() {},
      '/settings/general': generalSettingsHandler,
    });

    it('matches an exact route', () => {
      expect.assertions(2);
      matchRoute('/settings/general').map(route => {
        expect(route.pathname).toBe('/settings/general');
        expect(route.handler).toBe(generalSettingsHandler);
      });
    });

    it('does not partially match exact routes', () => {
      expect(matchRoute('/settings')).toEqual(none);
    });

    // expect caller to extract and pass in just the pathname
    it('does not match pathname with query', () => {
      expect(matchRoute('/settings/general?q=baz')).toEqual(none);
    });
  });

  describe('params routes', () => {
    const importantMessageHandler = () => {};
    const messageHandler = () => {};
    const replyMessageHandler = () => {};
    const matchRoute = routeMatcher({
      '/'() {},
      '/inbox/important': importantMessageHandler,
      '/inbox/:message': messageHandler,
      '/inbox/:message/replies/:reply': replyMessageHandler,
      '/settings/general'() {},
    });

    it('matches exact route first, if existed', () => {
      expect.assertions(2);
      matchRoute('/inbox/important').map(route => {
        expect(route.pathname).toBe('/inbox/important');
        expect(route.handler).toBe(importantMessageHandler);
      });
    });

    it('matches params route', () => {
      expect.assertions(3);
      matchRoute('/inbox/rl4mcq').map(route => {
        expect(route.pathname).toBe('/inbox/rl4mcq');
        expect(route.handler).toBe(messageHandler);
        expect(route.params).toEqual({ message: 'rl4mcq' });
      });
    });

    it('matches nested params routes', () => {
      expect.assertions(3);
      matchRoute('/inbox/rl4mcq/replies/LsbSK').map(route => {
        expect(route.pathname).toBe('/inbox/rl4mcq/replies/LsbSK');
        expect(route.handler).toBe(replyMessageHandler);
        expect(route.params).toEqual({ message: 'rl4mcq', reply: 'LsbSK' });
      });
    });
  });
});
