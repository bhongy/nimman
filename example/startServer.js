'use strict';

const { createDevServer } = require('../dist/DevServer/DevServer');

(async () => {
  await createDevServer().start();
  console.log('Server is ready: http://localhost:3000');
})();
