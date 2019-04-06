'use strict';

const { createDevServer } = require('../dist/DevServer/DevServer');

(async () => {
  const port = 3000;
  await createDevServer().start(port);
  console.log(`Server is ready: http://localhost:${port}`);
})();
