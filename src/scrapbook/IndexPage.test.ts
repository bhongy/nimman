import { IndexPage } from './IndexPage';

describe('IndexPage.test', () => {
  it('matches index page patterns', () => {
    expect(IndexPage.test('/index.ts')).toBe(true);
  });
});
