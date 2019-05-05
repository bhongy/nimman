# Server Design

## Features

- [ ] **graceful shutdown** (close) i.e. deploying a new version (container)
  - stop accepting new connections
  - close existing, idle connections
  - wait for in-flight requests to finish
  - investigate: https://www.npmjs.com/package/stoppable
  - ^ check if the node v10,12 `server.close` does this by default (doubtful)
  - log error if error of graceful shutdown
