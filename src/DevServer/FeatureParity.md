# List of Features to Implement

## [`webpack-dev-middleware`](https://github.com/webpack/webpack-dev-middleware/tree/dba5e02876bb76d2301c93d20ec90f558147d5b4)

Primary feature is to serve static files build by webpack.

- [ ] serve static (webpack bundled) files
  - [ ] supports `req.headers.range` (partial response for large files)
  - does not seem to handle the partial case when the content changed (new compilation)
  - look into `send` package to handle partial response functionality
- [ ] holds the response (calling `next`) until the compilation is completed (`waitUntilValid`)
  - this is blocked/held for all requests (not just webpack bundles)
  - which means it "hooks" into webpack compilations
- [ ] compilation output (assets) is in memory (`MemoryFileSystem`)
  - pro: does not mess with host file system (no clean up, permission issue, delete wrong thing)
  - pro: faster read & write than disk
  - con: confusing and hard to debug (not accessible)
  - con: non-persistent (if the server crashes, they're gone) ... that's fine
- [ ] output can also be written to disk (still use Memory FS but "also write to disk)
  - [ ] allow filtering files that will be written to disk (all files are still written to MemoryFS)
- [ ] support lazy mode - i.e. not using webpack watch and compile only when a request arrives
  - the lazy mode still compiles **all entries** so the optimization is:
    - dev server startup time
    - a lot of file changes can occur but the compilation will happens once the request arrives
    - it won't recompile for subsequent requests if no changes to the files
- [ ] logs to stdout
  - [ ] compiling
  - [ ] compiled successful | successful with warning | failed
  - [ ] option to display compilation stats
- does *not* handle on-demand entry (will compile all entries regardless of watch or lazy modes)

## [`webpack-hot-server-middleware`](https://github.com/60frames/webpack-hot-server-middleware/tree/1d4306c9efab722e4b12ea38752e4e6855e36816)

- [ ] Hot reload server bundle as it's recompiled without needing to restart DevServer
  - [ ] get output server bundle filename from stats (no hardcoding)
  - [ ] "require" the file and validate the exported `renderer`
    (can we `delete require.cache[require.resolve(filepath)]` instead of using `requireFromString`?)
  - [ ] replace the `renderer` when new server compilation is done
  - [ ] client and server compilation stats are passed to the `renderer`
  - ? how to handle multi-page app render function (is it a thing?)
- [ ] Support server bundle source map

## Next.js

- [ ] ...
- [ ] affect document `<head>` from component (e.g. update `<title>`)
- [ ] ...

## Brain dump

- [ ] Do not split bundles (e.g. dynamic imports) for server-side render
  - without requiring application code to be concerned about it
