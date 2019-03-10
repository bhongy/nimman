/**
 * TEMPORARY while developing the framework
 * ---
 * Project Configurations, locations of files.
 * This should be passed as an input from the application to the framework.
 */

import * as path from 'path';

// files and directories

export const root = path.resolve(__dirname, '../../example'); // BOUNDARY
export const src = path.resolve(root, 'app');
export const dist = path.resolve(root, 'dist');
