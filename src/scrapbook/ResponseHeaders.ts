// import * as http from 'http';

const CacheControl = {
  get immutable() {
    return { 'Cache-Control': 'public, max-age=31536000, immutable' };
  },
};

const Content = {
  type(type: 'html') {
    return { 'Content-Type': 'text/html; charset=utf-8' };
  },

  length(length: number) {
    return { 'Content-Length': `${length}` };
  },
};

const merge = <T extends Record<string, string>>(objects: Array<T>): T =>
  objects.reduce((re, o) => Object.assign(re, o));

export const headers = merge([
  CacheControl.immutable,
  Content.type('html'),
  Content.length(100),
]);
