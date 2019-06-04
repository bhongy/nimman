# Server Design

## General guidelines

- fast startup
- graceful shutdown
- fast shutdown
- do as little as possible on start-up
  - maximize operations per request
- keep as little in shared memory as possible
  - localize data per request

## Features

- [ ] **graceful shutdown** (close) i.e. deploying a new version (container)
  - stop accepting new connections
  - close existing, idle connections
  - wait for in-flight requests to finish
  - investigate: https://www.npmjs.com/package/stoppable
  - ^ check if the node v10,12 `server.close` does this by default (doubtful)
  - log error if error of graceful shutdown
