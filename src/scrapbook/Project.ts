import * as path from 'path';

export const root = path.resolve(__dirname, '..');
export const fromRoot = path.resolve.bind(null, root);
