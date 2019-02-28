'use strict';

const { createDevServer } = require('../dist/DevServer/DevServer');

createDevServer()
  .start()
  .then(() => {
    console.log('Server is ready: http://localhost:3000');
  });
